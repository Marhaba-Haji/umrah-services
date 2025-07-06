
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  bookingId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productInfo: string;
  successUrl: string;
  failureUrl: string;
}

interface PaymentVerificationRequest {
  payuResponse: any;
  merchantTransactionId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } }
      }
    );

    const payuMerchantKey = Deno.env.get('PAYU_MERCHANT_KEY');
    const payuSalt = Deno.env.get('PAYU_SALT');
    
    if (!payuMerchantKey || !payuSalt) {
      throw new Error('PayU credentials not configured');
    }

    const requestBody = await req.json();
    
    // Handle payment initiation
    if (!requestBody.payuResponse) {
      const paymentRequest: PaymentRequest = requestBody;
      
      // Generate transaction ID
      const txnid = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Generate hash
      const hashString = `${payuMerchantKey}|${txnid}|${paymentRequest.amount}|${paymentRequest.productInfo}|${paymentRequest.customerName}|${paymentRequest.customerEmail}|||||||||||${payuSalt}`;
      const hash = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(hashString));
      const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');

      // Store payment transaction
      const { data: transaction, error: transactionError } = await supabaseClient
        .from('payment_transactions')
        .insert({
          booking_id: paymentRequest.bookingId,
          merchant_transaction_id: txnid,
          amount: paymentRequest.amount,
          customer_name: paymentRequest.customerName,
          customer_email: paymentRequest.customerEmail,
          customer_phone: paymentRequest.customerPhone,
          payu_hash: hashHex,
          success_url: paymentRequest.successUrl,
          failure_url: paymentRequest.failureUrl,
          payment_status: 'initiated'
        })
        .select()
        .single();

      if (transactionError) {
        throw new Error(`Failed to create payment transaction: ${transactionError.message}`);
      }

      const paymentData = {
        key: payuMerchantKey,
        txnid: txnid,
        amount: paymentRequest.amount.toString(),
        productinfo: paymentRequest.productInfo,
        firstname: paymentRequest.customerName,
        email: paymentRequest.customerEmail,
        phone: paymentRequest.customerPhone,
        surl: paymentRequest.successUrl,
        furl: paymentRequest.failureUrl,
        hash: hashHex,
        service_provider: 'payu_paisa'
      };

      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentData,
          transactionId: transaction.id,
          payuUrl: 'https://sandboxsecure.payu.in/_payment' // Use production URL for live
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Handle payment verification
    const { payuResponse, merchantTransactionId } = requestBody as PaymentVerificationRequest;

    // Verify hash
    const reverseHashString = `${payuSalt}|${payuResponse.status}|||||||||||${payuResponse.email}|${payuResponse.firstname}|${payuResponse.productinfo}|${payuResponse.amount}|${payuResponse.txnid}|${payuResponse.key}`;
    const reverseHash = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(reverseHashString));
    const reverseHashHex = Array.from(new Uint8Array(reverseHash)).map(b => b.toString(16).padStart(2, '0')).join('');

    const isValidHash = reverseHashHex === payuResponse.hash;

    // Update payment transaction
    const updateData: any = {
      payu_transaction_id: payuResponse.txnid,
      payu_payment_id: payuResponse.mihpayid,
      payment_status: payuResponse.status.toLowerCase(),
      payment_method: payuResponse.mode,
      payment_gateway_response: payuResponse,
      updated_at: new Date().toISOString()
    };

    if (payuResponse.status === 'success' && isValidHash) {
      updateData.completed_at = new Date().toISOString();
      updateData.payment_status = 'completed';
    } else if (payuResponse.status === 'failure') {
      updateData.payment_status = 'failed';
    }

    const { data: transaction, error: updateError } = await supabaseClient
      .from('payment_transactions')
      .update(updateData)
      .eq('merchant_transaction_id', merchantTransactionId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update payment transaction: ${updateError.message}`);
    }

    // Update booking status if payment successful
    if (payuResponse.status === 'success' && isValidHash && transaction.booking_id) {
      await supabaseClient
        .from('bookings')
        .update({ 
          payment_status: 'completed',
          payment_method: 'payu',
          payment_transaction_id: transaction.id,
          status: 'confirmed'
        })
        .eq('id', transaction.booking_id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        verified: isValidHash,
        status: payuResponse.status,
        transactionId: transaction.id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('PayU payment processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

console.log("PayU Edge Function started");
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  bookingId?: string;
  visaApplicationId?: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productInfo: string;
  successUrl: string;
  failureUrl: string;
}

interface PaymentVerificationRequest {
  payuResponse: Record<string, unknown>;
  merchantTransactionId: string;
}

interface PayUSettings {
  merchant_key: string;
  salt_32bit: string;
  salt_256bit?: string;
  gateway_url: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const rawBody = await req.text();
  console.log("Raw request body:", rawBody);
  let requestBody = null;
  try {
    requestBody = JSON.parse(rawBody);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Request body must be valid JSON." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Create Supabase client with service role key for bypassing RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get active PayU settings from database
    const getPayUSettings = async (): Promise<PayUSettings> => {
      // Fetch the active PayU environment directly from payment_gateway_settings
      const {
        data: settingsData,
        error: settingsError,
        count,
        status,
      } = await supabaseClient
        .from("payment_gateway_settings")
        .select(
          "merchant_key, salt_32bit, salt_256bit, gateway_url, environment, is_active",
          { count: "exact" },
        )
        .eq("gateway_name", "payu")
        .eq("is_active", true)
        .maybeSingle();

      console.log("[PayU] Query result for is_active=true:", {
        settingsData,
        error: settingsError,
        count,
        status,
      });

      if (settingsError || !settingsData) {
        console.error("Error fetching active PayU settings:", settingsError);
        throw new Error("Active PayU settings not found (is_active=true)");
      }

      console.log(
        "[PayU] Using environment:",
        settingsData.environment,
        "All fields:",
        settingsData,
      );
      return settingsData;
    };

    const payuSettings = await getPayUSettings();
    console.log("Using PayU settings for environment");

    // Handle payment initiation
    if (!requestBody.payuResponse) {
      const paymentRequest: PaymentRequest = requestBody;

      console.log("Processing payment request:", paymentRequest);

      // Generate transaction ID
      const txnid = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Generate hash using appropriate salt
      const saltToUse = payuSettings.salt_256bit || payuSettings.salt_32bit;
      const hashString = `${payuSettings.merchant_key}|${txnid}|${paymentRequest.amount}|${paymentRequest.productInfo}|${paymentRequest.customerName}|${paymentRequest.customerEmail}|||||||||||${saltToUse}`;

      const hash = await crypto.subtle.digest(
        "SHA-512",
        new TextEncoder().encode(hashString),
      );
      const hashHex = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Store payment transaction with support for both bookings and visa applications
      const transactionData: Record<string, unknown> = {
        merchant_transaction_id: txnid,
        amount: paymentRequest.amount,
        customer_name: paymentRequest.customerName,
        customer_email: paymentRequest.customerEmail,
        customer_phone: paymentRequest.customerPhone,
        payu_hash: hashHex,
        success_url: paymentRequest.successUrl,
        failure_url: paymentRequest.failureUrl,
        payment_status: "initiated",
      };

      // Add booking_id or visa_application_id based on request
      if (paymentRequest.bookingId) {
        transactionData.booking_id = paymentRequest.bookingId;
      }
      if (paymentRequest.visaApplicationId) {
        transactionData.visa_application_id = paymentRequest.visaApplicationId;
      }

      console.log("Creating payment transaction:", transactionData);

      const { data: transaction, error: transactionError } =
        await supabaseClient
          .from("payment_transactions")
          .insert(transactionData)
          .select()
          .single();

      if (transactionError) {
        console.error("Transaction creation error:", transactionError);
        throw new Error(
          `Failed to create payment transaction: ${transactionError.message}`,
        );
      }

      console.log("Transaction created successfully:", transaction);

      const paymentData = {
        key: payuSettings.merchant_key,
        txnid: txnid,
        amount: paymentRequest.amount.toString(),
        productinfo: paymentRequest.productInfo,
        firstname: paymentRequest.customerName,
        email: paymentRequest.customerEmail,
        phone: paymentRequest.customerPhone,
        surl: paymentRequest.successUrl,
        furl: paymentRequest.failureUrl,
        hash: hashHex,
        service_provider: "payu_paisa",
      };

      return new Response(
        JSON.stringify({
          success: true,
          paymentData,
          transactionId: transaction.id,
          payuUrl: payuSettings.gateway_url,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Handle payment verification
    const { payuResponse, merchantTransactionId } =
      requestBody as PaymentVerificationRequest;

    console.log("Processing payment verification:", {
      payuResponse,
      merchantTransactionId,
    });

    // Verify hash using appropriate salt
    const saltToUse = payuSettings.salt_256bit || payuSettings.salt_32bit;
    const reverseHashString = `${saltToUse}|${payuResponse.status}|||||||||||${payuResponse.email}|${payuResponse.firstname}|${payuResponse.productinfo}|${payuResponse.amount}|${payuResponse.txnid}|${payuResponse.key}`;

    const reverseHash = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(reverseHashString),
    );
    const reverseHashHex = Array.from(new Uint8Array(reverseHash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const isValidHash = reverseHashHex === payuResponse.hash;

    // Update payment transaction
    const updateData: Record<string, unknown> = {
      payu_transaction_id: payuResponse.txnid,
      payu_payment_id: payuResponse.mihpayid,
      payment_status: payuResponse.status.toLowerCase(),
      payment_method: payuResponse.mode,
      payment_gateway_response: payuResponse,
      updated_at: new Date().toISOString(),
    };

    if (payuResponse.status === "success" && isValidHash) {
      updateData.completed_at = new Date().toISOString();
      updateData.payment_status = "completed";
    } else if (payuResponse.status === "failure") {
      updateData.payment_status = "failed";
    }

    const { data: transaction, error: updateError } = await supabaseClient
      .from("payment_transactions")
      .update(updateData)
      .eq("merchant_transaction_id", merchantTransactionId)
      .select()
      .single();

    if (updateError) {
      console.error("Transaction update error:", updateError);
      throw new Error(
        `Failed to update payment transaction: ${updateError.message}`,
      );
    }

    // Update booking or visa application status based on payment success
    if (payuResponse.status === "success" && isValidHash) {
      if (transaction.booking_id) {
        // Update booking status
        await supabaseClient
          .from("bookings")
          .update({
            payment_status: "completed",
            payment_method: "payu",
            payment_transaction_id: transaction.id,
            status: "confirmed",
          })
          .eq("id", transaction.booking_id);
      }

      if (transaction.visa_application_id) {
        // Update visa application status
        await supabaseClient
          .from("visa_applications")
          .update({
            payment_status: "completed",
            payment_method: "payu",
            payment_transaction_id: transaction.id,
            status: "payment_completed",
          })
          .eq("id", transaction.visa_application_id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        verified: isValidHash,
        status: payuResponse.status,
        transactionId: transaction.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("PayU payment processing error:", error);

    try {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      );
      await supabaseClient.from("function_error_logs").insert({
        function_name: "payu-payment-process",
        error_message: error?.message || String(error),
        request_payload: requestBody,
      });
    } catch (logError) {
      console.error("Failed to log error to DB:", logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

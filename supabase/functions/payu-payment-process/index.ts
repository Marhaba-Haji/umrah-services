console.log("PayU Edge Function started");
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function corsResponse(
  body: string | null,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(body, {
    status,
    headers: { ...corsHeaders, ...extraHeaders },
  });
}

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
  // CORS preflight handler must be first
  if (req.method === "OPTIONS") {
    return corsResponse(null, 200);
  }

  let rawBody = "";
  let supabaseClient: unknown = null;
  try {
    supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    rawBody = await req.text();
    await supabaseClient.from("function_error_logs").insert({
      function_name: "payu-payment-process",
      error_message: "INCOMING_REQUEST",
      request_payload: {
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
        timestamp: new Date().toISOString(),
        raw_body: rawBody,
      },
    });

    let requestBody = null;
    try {
      requestBody = JSON.parse(rawBody);
    } catch (e) {
      return corsResponse(
        JSON.stringify({ error: "Request body must be valid JSON." }),
        400,
        { "Content-Type": "application/json" },
      );
    }

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
        return corsResponse(
          JSON.stringify({
            success: false,
            error: `Failed to create payment transaction: ${transactionError.message}`,
          }),
          500,
          { "Content-Type": "application/json" },
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

      return corsResponse(
        JSON.stringify({
          success: true,
          paymentData,
          transactionId: transaction.id,
          payuUrl: payuSettings.gateway_url,
        }),
        200,
        { "Content-Type": "application/json" },
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
      payment_status: payuResponse.status?.toLowerCase(),
      payment_method: payuResponse.mode,
      payu_hash: payuResponse.hash,
      payment_gateway_response: payuResponse,
      updated_at: new Date().toISOString(),
      payer_upi_id: payuResponse.field3,
      payment_status_detail: payuResponse.field7,
      payment_channel: payuResponse.field8,
      payment_status_message: payuResponse.field9,
      bank_ref_num: payuResponse.bank_ref_num,
      PG_TYPE: payuResponse.PG_TYPE,
      productinfo: payuResponse.productinfo,
      error_message: payuResponse.error_Message,
      amount: payuResponse.amount,
    };
    console.log("Update data for payment_transactions:", updateData);

    if (payuResponse.status === "success" && isValidHash) {
      updateData.completed_at = new Date().toISOString();
      updateData.payment_status = "completed";
    } else if (payuResponse.status === "failure") {
      updateData.payment_status = "failed";
    }

    console.log(
      "Updating payment_transactions with:",
      updateData,
      "for merchantTransactionId:",
      merchantTransactionId,
    );

    const { data: transaction, error: updateError } = await supabaseClient
      .from("payment_transactions")
      .update(updateData)
      .eq("merchant_transaction_id", merchantTransactionId)
      .select()
      .single();

    if (updateError) {
      console.error("Payment transaction update error:", updateError);
      return corsResponse(
        JSON.stringify({
          success: false,
          error: `Failed to update payment transaction: ${updateError.message}`,
        }),
        500,
        { "Content-Type": "application/json" },
      );
    }
    if (!transaction) {
      console.error(
        "No payment transaction found for merchantTransactionId:",
        merchantTransactionId,
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
        // Prepare update data
        const visaUpdateData = {
          payment_status: "completed",
          payment_method: "payu",
          payment_transaction_id: transaction.id,
          status: "completed",
        };
        // Update visa application status
        const { error: visaUpdateError } = await supabaseClient
          .from("visa_applications")
          .update(visaUpdateData)
          .eq("id", transaction.visa_application_id);

        // Log the update attempt (success or failure)
        await supabaseClient.from("visa_application_update_logs").insert({
          visa_application_id: transaction.visa_application_id,
          transaction_id: transaction.id,
          update_data: visaUpdateData,
          result: visaUpdateError ? "failure" : "success",
          error_message: visaUpdateError
            ? String(visaUpdateError.message || visaUpdateError)
            : null,
          created_at: new Date().toISOString(),
        });

        if (visaUpdateError) {
          console.error("Visa application update error:", visaUpdateError);
          // Optionally, throw or handle this error
        }
      }
    }

    return corsResponse(
      JSON.stringify({
        success: true,
        verified: isValidHash,
        status: payuResponse.status,
        transactionId: transaction.id,
      }),
      200,
      { "Content-Type": "application/json" },
    );
  } catch (error) {
    console.error("Unhandled error in payu-payment-process:", error);
    // Log error to function_error_logs
    if (supabaseClient) {
      await supabaseClient.from("function_error_logs").insert({
        function_name: "payu-payment-process",
        error_message: error instanceof Error ? error.message : String(error),
        request_payload: {
          method: req.method,
          headers: Object.fromEntries(req.headers.entries()),
          timestamp: new Date().toISOString(),
          raw_body: rawBody,
        },
      });
    }
    return corsResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      500,
      { "Content-Type": "application/json" },
    );
  }
});

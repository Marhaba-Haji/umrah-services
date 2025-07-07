import { supabase } from "@/integrations/supabase/client";

interface PaymentRequest {
  bookingId?: string;
  visaApplicationId?: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productInfo: string;
}

interface PaymentResponse {
  success: boolean;
  paymentData?: Record<string, string>;
  payuUrl?: string;
  transactionId?: string;
  error?: string;
}

export const initiatePayment = async (
  paymentRequest: PaymentRequest,
): Promise<PaymentResponse> => {
  try {
    const currentUrl = window.location.origin;
    const successUrl = `${currentUrl}/payment-success`;
    const failureUrl = `${currentUrl}/payment/failure`;

    const { data, error } = await supabase.functions.invoke(
      "payu-payment-process",
      {
        body: {
          ...paymentRequest,
          successUrl,
          failureUrl,
        },
      },
    );

    if (error) {
      console.error("Payment initiation error:", error);
      if (error.response && typeof error.response.json === "function") {
        error.response
          .json()
          .then((errBody) => {
            console.error("Edge Function error body:", errBody);
          })
          .catch((e) => {
            console.error("Failed to parse error response body:", e);
          });
      } else if (error.data) {
        console.error("Edge Function error data:", error.data);
      } else {
        console.error("Edge Function error (raw):", error);
      }
      return {
        success: false,
        error: error.message || "Failed to initiate payment",
      };
    }

    return data;
  } catch (error) {
    console.error("Payment service error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment service error",
    };
  }
};

export const redirectToPayU = (
  paymentData: Record<string, string>,
  payuUrl: string,
) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payuUrl;
  form.style.display = "none";

  Object.keys(paymentData).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = paymentData[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export const verifyPayment = async (
  payuResponse: Record<string, string>,
  merchantTransactionId: string,
) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "payu-payment-process",
      {
        body: {
          payuResponse,
          merchantTransactionId,
        },
      },
    );

    if (error) {
      console.error("Payment verification error:", error);
      return {
        success: false,
        error: error.message || "Failed to verify payment",
      };
    }

    return data;
  } catch (error) {
    console.error("Payment verification service error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Payment verification service error",
    };
  }
};

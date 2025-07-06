
import { supabase } from "@/integrations/supabase/client";

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productInfo: string;
  successUrl?: string;
  failureUrl?: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  paymentData?: any;
  transactionId?: string;
  payuUrl?: string;
  error?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  verified?: boolean;
  status?: string;
  transactionId?: string;
  error?: string;
}

export const initiatePayment = async (paymentRequest: PaymentRequest): Promise<PaymentInitiationResponse> => {
  try {
    const baseUrl = window.location.origin;
    const requestData = {
      ...paymentRequest,
      successUrl: paymentRequest.successUrl || `${baseUrl}/payment/success`,
      failureUrl: paymentRequest.failureUrl || `${baseUrl}/payment/failure`
    };

    const { data, error } = await supabase.functions.invoke('payu-payment-process', {
      body: requestData,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Payment initiation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment initiation failed'
    };
  }
};

export const verifyPayment = async (payuResponse: any, merchantTransactionId: string): Promise<PaymentVerificationResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('payu-payment-process', {
      body: {
        payuResponse,
        merchantTransactionId
      },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed'
    };
  }
};

export const createPaymentForm = (paymentData: any, payuUrl: string): HTMLFormElement => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = payuUrl;
  form.style.display = 'none';

  Object.keys(paymentData).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = paymentData[key];
    form.appendChild(input);
  });

  return form;
};

export const redirectToPayU = (paymentData: any, payuUrl: string): void => {
  const form = createPaymentForm(paymentData, payuUrl);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};


import { supabase } from "@/integrations/supabase/client";

export interface PaymentGatewaySettings {
  merchant_key: string;
  salt_32bit: string;
  salt_256bit?: string;
  gateway_url: string;
  environment: 'test' | 'live';
}

export const getActivePaymentGatewaySettings = async (): Promise<PaymentGatewaySettings> => {
  try {
    // Get active environment
    const { data: envData, error: envError } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'payu_active_environment')
      .single();

    if (envError) throw envError;

    const activeEnvironment = JSON.parse(envData.setting_value as string);

    // Get settings for active environment
    const { data: settingsData, error: settingsError } = await supabase
      .from('payment_gateway_settings')
      .select('merchant_key, salt_32bit, salt_256bit, gateway_url, environment')
      .eq('gateway_name', 'payu')
      .eq('environment', activeEnvironment)
      .eq('is_active', true)
      .single();

    if (settingsError || !settingsData) {
      throw new Error('Payment gateway settings not found');
    }

    return {
      merchant_key: settingsData.merchant_key,
      salt_32bit: settingsData.salt_32bit,
      salt_256bit: settingsData.salt_256bit,
      gateway_url: settingsData.gateway_url,
      environment: settingsData.environment as 'test' | 'live',
    };
  } catch (error) {
    console.error('Error fetching payment gateway settings:', error);
    throw error;
  }
};

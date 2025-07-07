
-- Create a table to store payment gateway settings
CREATE TABLE payment_gateway_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name TEXT NOT NULL DEFAULT 'payu',
  environment TEXT NOT NULL CHECK (environment IN ('test', 'live')),
  is_active BOOLEAN NOT NULL DEFAULT false,
  merchant_key TEXT NOT NULL,
  salt_32bit TEXT NOT NULL,
  salt_256bit TEXT,
  gateway_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(gateway_name, environment)
);

-- Add RLS policies
ALTER TABLE payment_gateway_settings ENABLE ROW LEVEL SECURITY;

-- Admin full access policy
CREATE POLICY "Admin full access to payment gateway settings" 
  ON payment_gateway_settings 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Insert default test mode settings
INSERT INTO payment_gateway_settings (
  gateway_name, 
  environment, 
  is_active, 
  merchant_key, 
  salt_32bit, 
  gateway_url
) VALUES (
  'payu', 
  'test', 
  true, 
  'gtKFFx', 
  'eCwWELxi', 
  'https://sandboxsecure.payu.in/_payment'
);

-- Insert default live mode settings (placeholder values)
INSERT INTO payment_gateway_settings (
  gateway_name, 
  environment, 
  is_active, 
  merchant_key, 
  salt_32bit, 
  salt_256bit,
  gateway_url
) VALUES (
  'payu', 
  'live', 
  false, 
  'LIVE_MERCHANT_KEY', 
  'LIVE_SALT_32BIT', 
  'LIVE_SALT_256BIT',
  'https://secure.payu.in/_payment'
);

-- Add system setting to track current active environment
INSERT INTO system_settings (setting_key, setting_type, setting_value, description, is_public) 
VALUES (
  'payu_active_environment', 
  'payment', 
  '"test"'::jsonb, 
  'Active PayU environment (test or live)', 
  false
) ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_gateway_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_gateway_settings_updated_at
  BEFORE UPDATE ON payment_gateway_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_gateway_settings_updated_at();

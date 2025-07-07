-- Allow public update access to payment_gateway_settings (for testing only)
CREATE POLICY "Allow public update"
  ON payment_gateway_settings
  FOR UPDATE
  USING (true); 
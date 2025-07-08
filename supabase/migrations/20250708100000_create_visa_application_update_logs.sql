-- Migration: Create visa_application_update_logs table
CREATE TABLE IF NOT EXISTS visa_application_update_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_application_id UUID REFERENCES visa_applications(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES payment_transactions(id) ON DELETE SET NULL,
  update_data JSONB NOT NULL,
  result TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

-- Create payment transactions table to track PayU payments
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  payu_transaction_id TEXT,
  payu_payment_id TEXT,
  merchant_transaction_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  payu_hash TEXT,
  success_url TEXT,
  failure_url TEXT,
  payment_gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for payment transactions
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access to payment transactions" 
  ON public.payment_transactions 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Users can view their own payment transactions
CREATE POLICY "Users can view their own payment transactions" 
  ON public.payment_transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = payment_transactions.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX idx_payment_transactions_booking_id ON public.payment_transactions(booking_id);
CREATE INDEX idx_payment_transactions_merchant_id ON public.payment_transactions(merchant_transaction_id);
CREATE INDEX idx_payment_transactions_payu_id ON public.payment_transactions(payu_transaction_id);

-- Update bookings table to include payment status
ALTER TABLE public.bookings 
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN payment_method TEXT,
ADD COLUMN payment_transaction_id UUID REFERENCES public.payment_transactions(id);

-- Create trigger to update payment transactions timestamp
CREATE OR REPLACE FUNCTION update_payment_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_transactions_updated_at();

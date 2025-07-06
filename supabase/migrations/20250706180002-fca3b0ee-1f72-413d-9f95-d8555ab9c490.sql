
-- Phase 1: Database Schema Updates
-- Add visa_application_id to payment_transactions table to support visa payments
ALTER TABLE public.payment_transactions 
ADD COLUMN visa_application_id UUID REFERENCES public.visa_applications(id);

-- Create index for better performance on visa application payments
CREATE INDEX idx_payment_transactions_visa_application_id ON public.payment_transactions(visa_application_id);

-- Update RLS policy to allow users to view their visa application payment transactions
CREATE POLICY "Users can view their visa application payment transactions" 
  ON public.payment_transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.visa_applications 
      WHERE visa_applications.id = payment_transactions.visa_application_id 
      AND visa_applications.customer_id::text = auth.uid()::text
    )
  );

-- Add payment fields to visa_applications table
ALTER TABLE public.visa_applications 
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN payment_method TEXT,
ADD COLUMN payment_transaction_id UUID REFERENCES public.payment_transactions(id);

-- Add operations tracking fields to existing tables

-- Add vendor tracking and service delivery fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS vendor_status_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_delivery_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operations_notes TEXT,
ADD COLUMN IF NOT EXISTS priority_level TEXT DEFAULT 'low' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS assigned_operator_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS last_operation_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add operations tracking to individual service tables
ALTER TABLE flights 
ADD COLUMN IF NOT EXISTS vendor_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_delivery_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operations_notes TEXT;

ALTER TABLE hotels_bookings 
ADD COLUMN IF NOT EXISTS vendor_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_delivery_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operations_notes TEXT;

ALTER TABLE visas_bookings 
ADD COLUMN IF NOT EXISTS vendor_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_delivery_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operations_notes TEXT;

ALTER TABLE transports_bookings 
ADD COLUMN IF NOT EXISTS vendor_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_delivery_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operations_notes TEXT;

ALTER TABLE activities_bookings 
ADD COLUMN IF NOT EXISTS vendor_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_delivery_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operations_notes TEXT;

ALTER TABLE guides_bookings 
ADD COLUMN IF NOT EXISTS vendor_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_delivery_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operations_notes TEXT;

-- Create operations tracking table
CREATE TABLE IF NOT EXISTS operations_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL, -- 'flight', 'hotel', 'visa', 'transport', 'activity', 'guide'
    vendor_status JSONB DEFAULT '{}',
    service_delivery_status JSONB DEFAULT '{}',
    operations_notes TEXT,
    priority_level TEXT DEFAULT 'low' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
    assigned_operator_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create operations audit log
CREATE TABLE IF NOT EXISTS operations_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'vendor_mapped', 'vendor_confirmed', 'service_delivered', 'status_updated'
    previous_status JSONB,
    new_status JSONB,
    operator_id UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_operations_tracking_booking_id ON operations_tracking(booking_id);
CREATE INDEX IF NOT EXISTS idx_operations_tracking_service_type ON operations_tracking(service_type);
CREATE INDEX IF NOT EXISTS idx_operations_tracking_priority ON operations_tracking(priority_level);
CREATE INDEX IF NOT EXISTS idx_operations_audit_log_booking_id ON operations_audit_log(booking_id);
CREATE INDEX IF NOT EXISTS idx_operations_audit_log_created_at ON operations_audit_log(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_operations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_operations_tracking_updated_at 
    BEFORE UPDATE ON operations_tracking
    FOR EACH ROW EXECUTE FUNCTION update_operations_updated_at();

-- Add comments
COMMENT ON COLUMN orders.vendor_status_json IS 'JSON structure: {"flight": {"vendor_name": "Airline XYZ", "confirmation_status": "confirmed", "mapped_date": "2024-01-15"}}';
COMMENT ON COLUMN orders.service_delivery_json IS 'JSON structure: {"flight": {"service_delivered": true, "delivery_date": "2024-03-15", "delivery_status": "delivered"}}';
COMMENT ON COLUMN orders.priority_level IS 'Priority level for operations management';
COMMENT ON COLUMN orders.assigned_operator_id IS 'ID of the operator assigned to handle this booking';
COMMENT ON COLUMN orders.last_operation_update IS 'Timestamp of last operation update';

-- Enable RLS
ALTER TABLE operations_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations_audit_log ENABLE ROW LEVEL SECURITY;

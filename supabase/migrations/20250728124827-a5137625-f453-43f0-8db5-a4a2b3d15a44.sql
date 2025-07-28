
-- Create enums for order management
CREATE TYPE order_mode AS ENUM ('online', 'offline', 'phone', 'walk_in');
CREATE TYPE umrah_category AS ENUM ('group', 'independent', 'custom');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'completed', 'failed');
CREATE TYPE refund_status AS ENUM ('not_applicable', 'pending', 'refunded', 'partial_refund');
CREATE TYPE flight_type AS ENUM ('domestic', 'international');
CREATE TYPE trip_type AS ENUM ('one_way', 'round_trip');
CREATE TYPE cabin_class AS ENUM ('economy', 'premium_economy', 'business', 'first');
CREATE TYPE visa_type AS ENUM ('tourist', 'business', 'umrah', 'hajj', 'transit');
CREATE TYPE payment_mode AS ENUM ('cash', 'card', 'bank_transfer', 'upi', 'wallet', 'cheque');

-- Create customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    date_of_birth DATE,
    passport_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table (central order management)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_mode order_mode NOT NULL DEFAULT 'online',
    umrah_category umrah_category,
    order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    departure_date DATE,
    return_date DATE,
    traveler_count INTEGER NOT NULL DEFAULT 1,
    order_status order_status NOT NULL DEFAULT 'pending',
    vendor_status_json JSONB DEFAULT '{}',
    order_details_json JSONB DEFAULT '{}',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    amount_received DECIMAL(10,2) NOT NULL DEFAULT 0,
    amount_pending DECIMAL(10,2) NOT NULL DEFAULT 0,
    received_details_json JSONB DEFAULT '[]',
    cancellation_reason TEXT,
    refund_status refund_status NOT NULL DEFAULT 'not_applicable',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table (links orders to services)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL, -- 'flight', 'hotel', 'visa', 'transport', 'activity', 'guide'
    item_id UUID NOT NULL, -- Foreign key to service-specific table
    item_description TEXT,
    item_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    item_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flights table
CREATE TABLE flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    flight_type flight_type NOT NULL,
    trip_type trip_type NOT NULL,
    departure_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    return_from_city TEXT,
    return_to_city TEXT,
    departure_date DATE NOT NULL,
    return_date DATE,
    adult_count INTEGER NOT NULL DEFAULT 1,
    child_count INTEGER NOT NULL DEFAULT 0,
    infant_count INTEGER NOT NULL DEFAULT 0,
    cabin_class cabin_class NOT NULL DEFAULT 'economy',
    airline_preference TEXT,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hotels table
CREATE TABLE hotels_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    hotel_name TEXT NOT NULL,
    city TEXT NOT NULL,
    room_count INTEGER NOT NULL DEFAULT 1,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    adult_count INTEGER NOT NULL DEFAULT 1,
    child_no_bed_count INTEGER NOT NULL DEFAULT 0,
    infant_count INTEGER NOT NULL DEFAULT 0,
    meal_plan TEXT DEFAULT 'room_only',
    room_type TEXT,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visas table
CREATE TABLE visas_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    visa_type visa_type NOT NULL,
    adult_count INTEGER NOT NULL DEFAULT 1,
    child_count INTEGER NOT NULL DEFAULT 0,
    infant_count INTEGER NOT NULL DEFAULT 0,
    processing_priority TEXT DEFAULT 'normal',
    embassy_location TEXT,
    application_date DATE,
    expected_delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transports table
CREATE TABLE transports_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    vehicle_name TEXT NOT NULL,
    route TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME,
    pax_count INTEGER NOT NULL DEFAULT 1,
    pickup_location TEXT,
    drop_location TEXT,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table
CREATE TABLE activities_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    activity_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME,
    pax_count INTEGER NOT NULL DEFAULT 1,
    vehicle_name TEXT,
    meeting_point TEXT,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guides table
CREATE TABLE guides_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    guide_service_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME,
    pax_count INTEGER NOT NULL DEFAULT 1,
    duration_hours INTEGER,
    meeting_point TEXT,
    language_preference TEXT,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_service_name ON order_items(service_name);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments to tables
COMMENT ON TABLE customers IS 'Stores customer information for all bookings';
COMMENT ON TABLE orders IS 'Central order management table - one record per overall order';
COMMENT ON TABLE order_items IS 'Links orders to multiple services - junction table';
COMMENT ON TABLE flights IS 'Flight booking details linked to order items';
COMMENT ON TABLE hotels_bookings IS 'Hotel booking details linked to order items';
COMMENT ON TABLE visas_bookings IS 'Visa application details linked to order items';
COMMENT ON TABLE transports_bookings IS 'Transport booking details linked to order items';
COMMENT ON TABLE activities_bookings IS 'Activity booking details linked to order items';
COMMENT ON TABLE guides_bookings IS 'Guide service booking details linked to order items';

-- Add sample JSON structure comments
COMMENT ON COLUMN orders.vendor_status_json IS 'JSON structure: {"flight": {"status": "confirmed", "vendor": "Airline XYZ"}, "hotel": {"status": "pending", "vendor": "Hotel ABC"}}';
COMMENT ON COLUMN orders.order_details_json IS 'JSON structure: {"flight": "completed", "hotel": "pending", "visa": "NA", "transport": "cancelled"}';
COMMENT ON COLUMN orders.received_details_json IS 'JSON array: [{"amount": 50000, "date": "2024-01-15", "mode": "card", "txn_id": "TXN123", "proof_url": "https://example.com/receipt.pdf"}]';

-- Enable Row Level Security on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transports_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin full access customers" ON customers FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access orders" ON orders FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access order_items" ON order_items FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access flights" ON flights FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access hotels_bookings" ON hotels_bookings FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access visas_bookings" ON visas_bookings FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access transports_bookings" ON transports_bookings FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access activities_bookings" ON activities_bookings FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access guides_bookings" ON guides_bookings FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Create policies for authenticated users to insert/view their own data
CREATE POLICY "Users can create customers" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view customers" ON customers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view orders" ON orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create order_items" ON order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view order_items" ON order_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create flights" ON flights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view flights" ON flights FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create hotels_bookings" ON hotels_bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view hotels_bookings" ON hotels_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create visas_bookings" ON visas_bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view visas_bookings" ON visas_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create transports_bookings" ON transports_bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view transports_bookings" ON transports_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create activities_bookings" ON activities_bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view activities_bookings" ON activities_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create guides_bookings" ON guides_bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view guides_bookings" ON guides_bookings FOR SELECT TO authenticated USING (true);

-- HealthInspect Rwanda - Complete Database Setup
-- Run this entire script in Supabase SQL Editor

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS inspection_items CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'pharmacy_inspector', 'hospital_inspector', 'viewer')),
    district VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create facilities table
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('hospital', 'pharmacy')),
    district VARCHAR(100) NOT NULL,
    sector VARCHAR(100),
    cell VARCHAR(100),
    village VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    license_number VARCHAR(100),
    owner_name VARCHAR(255),
    manager_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_inspection_date DATE,
    last_inspection_score INTEGER,
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspections table
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    inspector_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    inspection_type VARCHAR(50) NOT NULL DEFAULT 'routine',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIME,
    end_time TIME,
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    percentage DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'in_progress', 'completed', 'reviewed', 'approved')),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
    signature_url TEXT,
    inspector_notes TEXT,
    facility_response TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspection_items table
CREATE TABLE inspection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    category_id UUID,
    question TEXT NOT NULL,
    answer VARCHAR(50) NOT NULL CHECK (answer IN ('yes', 'no', 'na', 'compliant', 'non_compliant', 'not_applicable')),
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 1,
    comment TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test users
INSERT INTO users (phone, name, email, role, district) VALUES
('+250788123456', 'John Admin', 'admin@healthinspect.rw', 'super_admin', 'Kigali'),
('+250788234567', 'Marie Uwimana', 'marie@healthinspect.rw', 'pharmacy_inspector', 'Kigali'),
('+250788345678', 'Paul Mugisha', 'paul@healthinspect.rw', 'hospital_inspector', 'Kigali'),
('+250788456789', 'Grace Mukamana', 'grace@healthinspect.rw', 'pharmacy_inspector', 'Nyanza'),
('+250788567890', 'David Nkurunziza', 'david@healthinspect.rw', 'hospital_inspector', 'Huye');

-- Insert test pharmacies
INSERT INTO facilities (name, type, district, sector, address, phone, license_number, owner_name, manager_name) VALUES
('Pharmacy de la Paix', 'pharmacy', 'Kigali', 'Nyarugenge', 'KN 5 Ave, Kigali', '+250788111111', 'PH001', 'Jean Baptiste', 'Marie Claire'),
('Pharmacie Centrale', 'pharmacy', 'Kigali', 'Gasabo', 'KG 15 Ave, Kigali', '+250788222222', 'PH002', 'Emmanuel Nzeyimana', 'Alice Mukamana'),
('Pharmacie du Peuple', 'pharmacy', 'Kigali', 'Kicukiro', 'KK 20 St, Kigali', '+250788333333', 'PH003', 'Joseph Habimana', 'Beatrice Uwera'),
('Pharmacie Moderne', 'pharmacy', 'Nyanza', 'Nyanza', 'Nyanza Town', '+250788444444', 'PH004', 'Pierre Nsengimana', 'Claudine Mukeshimana'),
('Pharmacie Espoir', 'pharmacy', 'Huye', 'Huye', 'Huye Town', '+250788555555', 'PH005', 'Antoine Bizimana', 'Francine Uwimana');

-- Insert test hospitals
INSERT INTO facilities (name, type, district, sector, address, phone, license_number, owner_name, manager_name) VALUES
('King Faisal Hospital', 'hospital', 'Kigali', 'Gasabo', 'KG 544 St, Kigali', '+250788666666', 'HP001', 'Government of Rwanda', 'Dr. Emile Rwamasirabo'),
('University Teaching Hospital of Kigali', 'hospital', 'Kigali', 'Nyarugenge', 'KN 4 Ave, Kigali', '+250788777777', 'HP002', 'University of Rwanda', 'Dr. Vincent Mutabazi'),
('Nyanza District Hospital', 'hospital', 'Nyanza', 'Nyanza', 'Nyanza Town', '+250788888888', 'HP003', 'Ministry of Health', 'Dr. Agnes Mukamana'),
('Huye District Hospital', 'hospital', 'Huye', 'Huye', 'Huye Town', '+250788999999', 'HP004', 'Ministry of Health', 'Dr. Jean Claude Nzeyimana'),
('Kibagabaga Hospital', 'hospital', 'Kigali', 'Gasabo', 'Kibagabaga, Kigali', '+250788000000', 'HP005', 'Ministry of Health', 'Dr. Solange Uwimana');

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_facilities_type ON facilities(type);
CREATE INDEX idx_facilities_district ON facilities(district);
CREATE INDEX idx_inspections_facility_id ON inspections(facility_id);
CREATE INDEX idx_inspections_inspector_id ON inspections(inspector_id);
CREATE INDEX idx_inspections_date ON inspections(date);
CREATE INDEX idx_inspection_items_inspection_id ON inspection_items(inspection_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - you can restrict later)
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON facilities FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON inspections FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON inspection_items FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON audit_logs FOR ALL USING (true);

-- Verify the setup
SELECT 'Users created:' as info, count(*) as count FROM users
UNION ALL
SELECT 'Facilities created:', count(*) FROM facilities
UNION ALL
SELECT 'Pharmacies:', count(*) FROM facilities WHERE type = 'pharmacy'
UNION ALL
SELECT 'Hospitals:', count(*) FROM facilities WHERE type = 'hospital';

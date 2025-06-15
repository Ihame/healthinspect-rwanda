-- Quick setup script - run this first to get everything working
-- This will clear and recreate everything properly

-- Drop all tables in correct order
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS corrective_actions CASCADE;
DROP TABLE IF EXISTS inspection_items CASCADE;
DROP TABLE IF EXISTS inspection_categories CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'pharmacy_supervisor', 'hospital_supervisor', 'pharmacy_inspector', 'hospital_inspector')),
  district VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create facilities table
CREATE TABLE facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  level VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('hospital', 'pharmacy')),
  district VARCHAR(100) NOT NULL,
  sector VARCHAR(100),
  phone VARCHAR(20),
  owner_name VARCHAR(255),
  license_number VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  last_inspection_date DATE,
  last_inspection_score INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspections table
CREATE TABLE inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES users(id) ON DELETE CASCADE,
  inspection_type VARCHAR(50) DEFAULT 'routine',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  percentage DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'reviewed')),
  risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  inspector_notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test users
INSERT INTO users (id, name, phone, role, district, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'John Uwimana (Admin)', '+250788123456', 'super_admin', 'Kigali', true),
('22222222-2222-2222-2222-222222222222', 'Marie Mukamana (Pharmacy Inspector)', '+250788234567', 'pharmacy_inspector', 'Kigali', true),
('33333333-3333-3333-3333-333333333333', 'Paul Nkurunziza (Hospital Inspector)', '+250788345678', 'hospital_inspector', 'Kigali', true),
('44444444-4444-4444-4444-444444444444', 'Grace Uwimana (Pharmacy Inspector)', '+250788456789', 'pharmacy_inspector', 'Southern', true),
('55555555-5555-5555-5555-555555555555', 'David Habimana (Hospital Inspector)', '+250788567890', 'hospital_inspector', 'Eastern', true);

-- Insert test facilities
INSERT INTO facilities (id, name, level, type, district, sector, phone, owner_name, license_number, is_active, risk_level, latitude, longitude) VALUES
-- Pharmacies
('aaaa1111-1111-1111-1111-111111111111', 'Kigali Central Pharmacy', 'Community', 'pharmacy', 'GASABO', 'Remera', '+250788200001', 'Private Owner', 'PHAR-001', true, 'medium', -1.9441, 30.0619),
('aaaa2222-2222-2222-2222-222222222222', 'Nyamirambo Pharmacy', 'Community', 'pharmacy', 'NYARUGENGE', 'Nyamirambo', '+250788200002', 'Private Owner', 'PHAR-002', true, 'low', -1.9506, 30.0588),
('aaaa3333-3333-3333-3333-333333333333', 'Kimisagara Pharmacy', 'Community', 'pharmacy', 'GASABO', 'Kimisagara', '+250788200003', 'Private Owner', 'PHAR-003', true, 'high', -1.9441, 30.0619),
('aaaa4444-4444-4444-4444-444444444444', 'Gikondo Pharmacy', 'Community', 'pharmacy', 'KICUKIRO', 'Gikondo', '+250788200004', 'Private Owner', 'PHAR-004', true, 'medium', -1.9706, 30.1044),
('aaaa5555-5555-5555-5555-555555555555', 'Musanze Pharmacy', 'Community', 'pharmacy', 'MUSANZE', 'Musanze', '+250788200005', 'Private Owner', 'PHAR-005', true, 'low', -1.4989, 29.6336),
-- Hospitals
('bbbb1111-1111-1111-1111-111111111111', 'Kigali University Hospital (CHUK)', 'Referral', 'hospital', 'GASABO', 'Kacyiru', '+250788300001', 'Government', 'HOSP-001', true, 'low', -1.9441, 30.0619),
('bbbb2222-2222-2222-2222-222222222222', 'King Faisal Hospital', 'Referral', 'hospital', 'GASABO', 'Kacyiru', '+250788300002', 'Private', 'HOSP-002', true, 'medium', -1.9536, 30.0606),
('bbbb3333-3333-3333-3333-333333333333', 'Butaro District Hospital', 'District', 'hospital', 'BURERA', 'Butaro', '+250788300003', 'Government', 'HOSP-003', true, 'high', -1.4833, 29.8667),
('bbbb4444-4444-4444-4444-444444444444', 'Musanze District Hospital', 'District', 'hospital', 'MUSANZE', 'Musanze', '+250788300004', 'Government', 'HOSP-004', true, 'medium', -1.4989, 29.6336),
('bbbb5555-5555-5555-5555-555555555555', 'Nyagatare District Hospital', 'District', 'hospital', 'NYAGATARE', 'Nyagatare', '+250788300005', 'Government', 'HOSP-005', true, 'low', -1.2833, 30.3333);

-- Insert some sample inspections
INSERT INTO inspections (facility_id, inspector_id, date, score, percentage, status, risk_level, inspector_notes) VALUES
('aaaa1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '5 days', 85, 85, 'completed', 'low', 'Good overall compliance. Minor issues with documentation.'),
('bbbb1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '3 days', 92, 92, 'completed', 'low', 'Excellent standards maintained. No major issues found.'),
('aaaa3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '1 day', 65, 65, 'completed', 'high', 'Several compliance issues identified. Follow-up required.');

-- Verify data
SELECT 'Setup Complete!' as status;
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Facilities:', COUNT(*) FROM facilities  
UNION ALL
SELECT 'Pharmacies:', COUNT(*) FROM facilities WHERE type = 'pharmacy'
UNION ALL
SELECT 'Hospitals:', COUNT(*) FROM facilities WHERE type = 'hospital'
UNION ALL
SELECT 'Inspections:', COUNT(*) FROM inspections;

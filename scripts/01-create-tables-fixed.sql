-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS corrective_actions CASCADE;
DROP TABLE IF EXISTS inspection_items CASCADE;
DROP TABLE IF EXISTS inspection_categories CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with correct role constraints
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'pharmacy_supervisor', 'hospital_supervisor', 'pharmacy_inspector', 'hospital_inspector')),
  district VARCHAR(100),
  sector VARCHAR(100),
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create facilities table
CREATE TABLE facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100),
  level VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('hospital', 'pharmacy')),
  district VARCHAR(100) NOT NULL,
  sector VARCHAR(100),
  cell VARCHAR(100),
  village VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  email VARCHAR(255),
  owner_name VARCHAR(255),
  license_number VARCHAR(100),
  license_expiry DATE,
  is_active BOOLEAN DEFAULT true,
  risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  last_inspection_date DATE,
  last_inspection_score INTEGER,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspection_categories table
CREATE TABLE inspection_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  facility_type VARCHAR(20) NOT NULL CHECK (facility_type IN ('hospital', 'pharmacy', 'both')),
  weight INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspections table
CREATE TABLE inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES users(id) ON DELETE CASCADE,
  inspection_type VARCHAR(50) DEFAULT 'routine' CHECK (inspection_type IN ('routine', 'follow_up', 'complaint', 'licensing')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIME,
  end_time TIME,
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  percentage DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'reviewed', 'approved')),
  risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
  category_id UUID REFERENCES inspection_categories(id),
  question TEXT NOT NULL,
  answer VARCHAR(20) CHECK (answer IN ('compliant', 'non_compliant', 'not_applicable', 'partial')),
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 10,
  comment TEXT,
  photo_url TEXT,
  evidence_url TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create corrective_actions table
CREATE TABLE corrective_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
  inspection_item_id UUID REFERENCES inspection_items(id),
  finding TEXT NOT NULL,
  action_required TEXT NOT NULL,
  responsible_person VARCHAR(255),
  deadline DATE,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  completion_date DATE,
  completion_notes TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_district ON users(district);
CREATE INDEX idx_facilities_type ON facilities(type);
CREATE INDEX idx_facilities_district ON facilities(district);
CREATE INDEX idx_facilities_risk_level ON facilities(risk_level);
CREATE INDEX idx_inspections_facility_id ON inspections(facility_id);
CREATE INDEX idx_inspections_inspector_id ON inspections(inspector_id);
CREATE INDEX idx_inspections_date ON inspections(date);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_inspection_items_inspection_id ON inspection_items(inspection_id);
CREATE INDEX idx_inspection_items_category_id ON inspection_items(category_id);
CREATE INDEX idx_corrective_actions_inspection_id ON corrective_actions(inspection_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Add some triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_corrective_actions_updated_at BEFORE UPDATE ON corrective_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

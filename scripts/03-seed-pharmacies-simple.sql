-- Simple pharmacy seeding script that works with our current schema
DELETE FROM facilities WHERE type = 'pharmacy';

-- Insert basic pharmacies for testing
INSERT INTO facilities (name, level, type, district, sector, phone, owner_name, license_number, is_active, risk_level, created_by) VALUES
('Kigali Central Pharmacy', 'Community', 'pharmacy', 'GASABO', 'Remera', '+250788200001', 'Private Owner', 'LIC-001', true, 'medium', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Nyamirambo Pharmacy', 'Community', 'pharmacy', 'NYARUGENGE', 'Nyamirambo', '+250788200002', 'Private Owner', 'LIC-002', true, 'low', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Kimisagara Pharmacy', 'Community', 'pharmacy', 'GASABO', 'Kimisagara', '+250788200003', 'Private Owner', 'LIC-003', true, 'high', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Gikondo Pharmacy', 'Community', 'pharmacy', 'KICUKIRO', 'Gikondo', '+250788200004', 'Private Owner', 'LIC-004', true, 'medium', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Musanze Pharmacy', 'Community', 'pharmacy', 'MUSANZE', 'Musanze', '+250788200005', 'Private Owner', 'LIC-005', true, 'low', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Huye Pharmacy', 'Community', 'pharmacy', 'HUYE', 'Huye', '+250788200006', 'Private Owner', 'LIC-006', true, 'medium', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Rubavu Pharmacy', 'Community', 'pharmacy', 'RUBAVU', 'Gisenyi', '+250788200007', 'Private Owner', 'LIC-007', true, 'high', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Muhanga Pharmacy', 'Community', 'pharmacy', 'MUHANGA', 'Muhanga', '+250788200008', 'Private Owner', 'LIC-008', true, 'low', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Kayonza Pharmacy', 'Community', 'pharmacy', 'KAYONZA', 'Kayonza', '+250788200009', 'Private Owner', 'LIC-009', true, 'medium', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Rwamagana Pharmacy', 'Community', 'pharmacy', 'RWAMAGANA', 'Rwamagana', '+250788200010', 'Private Owner', 'LIC-010', true, 'high', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1));

-- Add some test hospitals too
INSERT INTO facilities (name, level, type, district, sector, phone, owner_name, license_number, is_active, risk_level, created_by) VALUES
('Kigali University Hospital', 'Referral', 'hospital', 'GASABO', 'Kacyiru', '+250788300001', 'Government', 'HOSP-001', true, 'low', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Butaro District Hospital', 'District', 'hospital', 'BURERA', 'Butaro', '+250788300002', 'Government', 'HOSP-002', true, 'medium', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)),
('Musanze District Hospital', 'District', 'hospital', 'MUSANZE', 'Musanze', '+250788300003', 'Government', 'HOSP-003', true, 'high', (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1));

-- Verify the data
SELECT 'Pharmacies inserted:' as info, COUNT(*) as count FROM facilities WHERE type = 'pharmacy';
SELECT 'Hospitals inserted:' as info, COUNT(*) as count FROM facilities WHERE type = 'hospital';

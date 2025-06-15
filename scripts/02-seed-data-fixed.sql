-- Clear existing data first
DELETE FROM corrective_actions;
DELETE FROM inspection_items;
DELETE FROM inspections;
DELETE FROM facilities;
DELETE FROM users;

-- Insert sample users with correct role names
INSERT INTO users (id, name, phone, role, district, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'John Uwimana', '+250788123456', 'super_admin', 'Kigali', true),
('00000000-0000-0000-0000-000000000002', 'Marie Mukamana', '+250788234567', 'pharmacy_inspector', 'Kigali', true),
('00000000-0000-0000-0000-000000000003', 'Paul Nkurunziza', '+250788345678', 'hospital_inspector', 'Northern', true),
('00000000-0000-0000-0000-000000000004', 'Grace Uwimana', '+250788456789', 'pharmacy_inspector', 'Southern', true),
('00000000-0000-0000-0000-000000000005', 'David Habimana', '+250788567890', 'hospital_inspector', 'Eastern', true),
('00000000-0000-0000-0000-000000000006', 'Sarah Uwimana', '+250788678901', 'pharmacy_supervisor', 'Kigali', true),
('00000000-0000-0000-0000-000000000007', 'James Nkurunziza', '+250788789012', 'hospital_supervisor', 'Northern', true);

-- Insert sample facilities
INSERT INTO facilities (id, name, level, type, district, latitude, longitude, is_active, risk_level, created_by) VALUES
('10000000-0000-0000-0000-000000000001', 'Kigali University Teaching Hospital', 'Referral', 'hospital', 'Kigali', -1.9441, 30.0619, true, 'medium', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000002', 'King Faisal Hospital', 'District', 'hospital', 'Kigali', -1.9536, 30.0606, true, 'low', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000003', 'Pharmacy de la Paix', 'Community', 'pharmacy', 'Kigali', -1.9506, 30.0588, true, 'low', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000004', 'Butaro Hospital', 'District', 'hospital', 'Northern', -1.4833, 29.8667, true, 'medium', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000005', 'Nyagatare District Hospital', 'District', 'hospital', 'Eastern', -1.2833, 30.3333, true, 'high', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000006', 'Pharmacy Centrale', 'Community', 'pharmacy', 'Southern', -2.6167, 29.7333, true, 'medium', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000007', 'Ruhengeri Hospital', 'Provincial', 'hospital', 'Northern', -1.4989, 29.6336, true, 'low', '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000008', 'Pharmacy Moderne', 'Community', 'pharmacy', 'Eastern', -1.2833, 30.3333, true, 'high', '00000000-0000-0000-0000-000000000001');

-- Insert sample inspections
INSERT INTO inspections (id, facility_id, inspector_id, inspection_type, date, score, max_score, percentage, status, risk_level, follow_up_required) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'routine', CURRENT_DATE - INTERVAL '5 days', 85, 100, 85, 'completed', 'medium', false),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'routine', CURRENT_DATE - INTERVAL '3 days', 92, 100, 92, 'completed', 'low', false),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'routine', CURRENT_DATE - INTERVAL '1 day', 78, 100, 78, 'in_progress', 'high', true);

-- Create inspection categories first
INSERT INTO inspection_categories (id, name, description, facility_type, weight, is_active) VALUES
('30000000-0000-0000-0000-000000000001', 'Infection Control', 'Infection prevention and control measures', 'both', 3, true),
('30000000-0000-0000-0000-000000000002', 'Waste Management', 'Medical waste handling and disposal', 'both', 2, true),
('30000000-0000-0000-0000-000000000003', 'Equipment', 'Medical equipment and maintenance', 'both', 3, true),
('30000000-0000-0000-0000-000000000004', 'Records', 'Patient records and documentation', 'both', 2, true),
('30000000-0000-0000-0000-000000000005', 'Pharmacy Storage', 'Drug storage and handling', 'pharmacy', 4, true);

-- Insert sample inspection items
INSERT INTO inspection_items (inspection_id, category_id, question, answer, score, max_score, priority) VALUES
('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Are hand washing facilities available?', 'compliant', 10, 10, 'high'),
('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Is hand sanitizer available at entry points?', 'non_compliant', 0, 5, 'medium'),
('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Are medical waste containers properly labeled?', 'compliant', 8, 10, 'high'),
('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', 'Is refrigeration equipment functioning properly?', 'compliant', 15, 15, 'critical'),
('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000004', 'Are patient records properly maintained?', 'compliant', 10, 10, 'medium');

-- Insert sample corrective actions
INSERT INTO corrective_actions (inspection_id, finding, action_required, deadline, priority, status) VALUES
('20000000-0000-0000-0000-000000000001', 'Hand sanitizer not available at main entrance', 'Install hand sanitizer dispensers at all entry points', CURRENT_DATE + INTERVAL '14 days', 'medium', 'pending'),
('20000000-0000-0000-0000-000000000003', 'Medical waste segregation not properly followed', 'Retrain staff on proper waste segregation procedures', CURRENT_DATE + INTERVAL '7 days', 'high', 'pending');

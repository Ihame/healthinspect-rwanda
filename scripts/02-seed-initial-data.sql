-- Seed initial data for the health inspection system

-- Insert super admin (Urubuto Fedine)
INSERT INTO users (id, name, email, phone, role, district, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'Urubuto Fedine', 'urubuto.fedine@rssb.rw', '+250788000001', 'super_admin', 'National', TRUE);

-- Insert supervisors
INSERT INTO users (id, name, email, phone, role, district, created_by, is_active) VALUES
('00000000-0000-0000-0000-000000000002', 'Dr. Jean Baptiste Uwimana', 'j.uwimana@rssb.rw', '+250788000002', 'pharmacy_supervisor', 'National', '00000000-0000-0000-0000-000000000001', TRUE),
('00000000-0000-0000-0000-000000000003', 'Dr. Marie Claire Mukamana', 'm.mukamana@rssb.rw', '+250788000003', 'hospital_supervisor', 'National', '00000000-0000-0000-0000-000000000001', TRUE);

-- Insert regular inspectors
INSERT INTO users (id, name, email, phone, role, district, created_by, is_active) VALUES
('00000000-0000-0000-0000-000000000004', 'Paul Nkurunziza', 'p.nkurunziza@rssb.rw', '+250788000004', 'pharmacy_inspector', 'Kigali', '00000000-0000-0000-0000-000000000002', TRUE),
('00000000-0000-0000-0000-000000000005', 'Grace Uwimana', 'g.uwimana@rssb.rw', '+250788000005', 'pharmacy_inspector', 'Northern', '00000000-0000-0000-0000-000000000002', TRUE),
('00000000-0000-0000-0000-000000000006', 'David Habimana', 'd.habimana@rssb.rw', '+250788000006', 'hospital_inspector', 'Kigali', '00000000-0000-0000-0000-000000000003', TRUE),
('00000000-0000-0000-0000-000000000007', 'Sarah Nyirahabimana', 's.nyirahabimana@rssb.rw', '+250788000007', 'hospital_inspector', 'Southern', '00000000-0000-0000-0000-000000000003', TRUE);

-- Insert inspection categories for pharmacies
INSERT INTO inspection_categories (id, name, description, facility_type, weight) VALUES
('10000000-0000-0000-0000-000000000001', 'Infrastructure & Equipment', 'Physical infrastructure, equipment and utilities', 'pharmacy', 20),
('10000000-0000-0000-0000-000000000002', 'Storage & Inventory Management', 'Drug storage conditions and inventory control', 'pharmacy', 25),
('10000000-0000-0000-0000-000000000003', 'Personnel & Qualifications', 'Staff qualifications and professional conduct', 'pharmacy', 20),
('10000000-0000-0000-0000-000000000004', 'Documentation & Records', 'Record keeping and documentation systems', 'pharmacy', 15),
('10000000-0000-0000-0000-000000000005', 'Quality Assurance', 'Quality control and assurance measures', 'pharmacy', 10),
('10000000-0000-0000-0000-000000000006', 'Regulatory Compliance', 'Compliance with laws and regulations', 'pharmacy', 10);

-- Insert inspection categories for hospitals
INSERT INTO inspection_categories (id, name, description, facility_type, weight) VALUES
('20000000-0000-0000-0000-000000000001', 'Infection Prevention & Control', 'Infection control measures and protocols', 'hospital', 25),
('20000000-0000-0000-0000-000000000002', 'Patient Safety & Care', 'Patient safety measures and quality of care', 'hospital', 25),
('20000000-0000-0000-0000-000000000003', 'Medical Equipment & Facilities', 'Medical equipment and facility standards', 'hospital', 20),
('20000000-0000-0000-0000-000000000004', 'Staff Competency & Training', 'Staff qualifications and training programs', 'hospital', 15),
('20000000-0000-0000-0000-000000000005', 'Emergency Preparedness', 'Emergency response and preparedness', 'hospital', 10),
('20000000-0000-0000-0000-000000000006', 'Regulatory & Documentation', 'Compliance and documentation standards', 'hospital', 5);

-- Insert sample hospitals
INSERT INTO facilities (id, name, registration_number, level, type, district, sector, phone, owner_name, license_number, created_by) VALUES
('30000000-0000-0000-0000-000000000001', 'Kigali University Teaching Hospital (CHUK)', 'HOSP-001', 'Referral', 'hospital', 'GASABO', 'Kacyiru', '+250788100001', 'Ministry of Health', 'LIC-HOSP-001', '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000002', 'King Faisal Hospital', 'HOSP-002', 'Referral', 'hospital', 'GASABO', 'Kacyiru', '+250788100002', 'King Faisal Hospital Rwanda', 'LIC-HOSP-002', '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000003', 'Butaro Hospital', 'HOSP-003', 'District', 'hospital', 'BURERA', 'Butaro', '+250788100003', 'Partners In Health', 'LIC-HOSP-003', '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000004', 'Nyagatare District Hospital', 'HOSP-004', 'District', 'hospital', 'NYAGATARE', 'Nyagatare', '+250788100004', 'Ministry of Health', 'LIC-HOSP-004', '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000005', 'Ruhengeri Hospital', 'HOSP-005', 'Provincial', 'hospital', 'MUSANZE', 'Musanze', '+250788100005', 'Ministry of Health', 'LIC-HOSP-005', '00000000-0000-0000-0000-000000000001');

-- Insert sample inspections
INSERT INTO inspections (id, facility_id, inspector_id, inspection_type, date, score, max_score, percentage, status, risk_level) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'routine', CURRENT_DATE - INTERVAL '5 days', 85, 100, 85.00, 'completed', 'low'),
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'routine', CURRENT_DATE - INTERVAL '3 days', 92, 100, 92.00, 'completed', 'low'),
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'routine', CURRENT_DATE - INTERVAL '1 day', 78, 100, 78.00, 'completed', 'medium');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
('00000000-0000-0000-0000-000000000002', 'New Inspection Completed', 'A new pharmacy inspection has been completed and requires review.', 'info'),
('00000000-0000-0000-0000-000000000003', 'Follow-up Required', 'Hospital inspection at Butaro Hospital requires follow-up action.', 'warning'),
('00000000-0000-0000-0000-000000000001', 'System Update', 'Monthly inspection reports are now available for download.', 'success');

-- Insert sample users
INSERT INTO users (name, phone, role, district) VALUES
('John Uwimana', '+250788123456', 'admin', 'Kigali'),
('Marie Mukamana', '+250788234567', 'pharmacy_inspector', 'Kigali'),
('Paul Nkurunziza', '+250788345678', 'hospital_inspector', 'Northern'),
('Grace Uwimana', '+250788456789', 'pharmacy_inspector', 'Southern'),
('David Habimana', '+250788567890', 'hospital_inspector', 'Eastern');

-- Insert sample facilities
INSERT INTO facilities (name, level, type, district, latitude, longitude) VALUES
('Kigali University Teaching Hospital', 'Referral', 'hospital', 'Kigali', -1.9441, 30.0619),
('King Faisal Hospital', 'District', 'hospital', 'Kigali', -1.9536, 30.0606),
('Pharmacy de la Paix', 'Community', 'pharmacy', 'Kigali', -1.9506, 30.0588),
('Butaro Hospital', 'District', 'hospital', 'Northern', -1.4833, 29.8667),
('Nyagatare District Hospital', 'District', 'hospital', 'Eastern', -1.2833, 30.3333),
('Pharmacy Centrale', 'Community', 'pharmacy', 'Southern', -2.6167, 29.7333),
('Ruhengeri Hospital', 'Provincial', 'hospital', 'Northern', -1.4989, 29.6336),
('Pharmacy Moderne', 'Community', 'pharmacy', 'Eastern', -1.2833, 30.3333);

-- Insert sample inspections
INSERT INTO inspections (facility_id, inspector_id, date, score, status) VALUES
((SELECT id FROM facilities WHERE name = 'Kigali University Teaching Hospital'), 
 (SELECT id FROM users WHERE name = 'Paul Nkurunziza'), 
 CURRENT_DATE - INTERVAL '5 days', 85, 'completed'),
((SELECT id FROM facilities WHERE name = 'Pharmacy de la Paix'), 
 (SELECT id FROM users WHERE name = 'Marie Mukamana'), 
 CURRENT_DATE - INTERVAL '3 days', 92, 'completed'),
((SELECT id FROM facilities WHERE name = 'Butaro Hospital'), 
 (SELECT id FROM users WHERE name = 'Paul Nkurunziza'), 
 CURRENT_DATE - INTERVAL '1 day', 78, 'pending');

-- Insert sample inspection items
INSERT INTO inspection_items (inspection_id, category, question, answer, weight) VALUES
((SELECT id FROM inspections WHERE score = 85), 'Infection Control', 'Are hand washing facilities available?', 'yes', 2),
((SELECT id FROM inspections WHERE score = 85), 'Infection Control', 'Is hand sanitizer available at entry points?', 'no', 1),
((SELECT id FROM inspections WHERE score = 85), 'Waste Management', 'Are medical waste containers properly labeled?', 'yes', 2),
((SELECT id FROM inspections WHERE score = 92), 'Equipment', 'Is refrigeration equipment functioning properly?', 'yes', 3),
((SELECT id FROM inspections WHERE score = 92), 'Records', 'Are patient records properly maintained?', 'yes', 2);

-- Insert sample corrective actions
INSERT INTO corrective_actions (inspection_id, finding, action, deadline, resolved) VALUES
((SELECT id FROM inspections WHERE score = 85), 
 'Hand sanitizer not available at main entrance', 
 'Install hand sanitizer dispensers at all entry points', 
 CURRENT_DATE + INTERVAL '14 days', 
 FALSE),
((SELECT id FROM inspections WHERE score = 78), 
 'Medical waste segregation not properly followed', 
 'Retrain staff on proper waste segregation procedures', 
 CURRENT_DATE + INTERVAL '7 days', 
 FALSE);

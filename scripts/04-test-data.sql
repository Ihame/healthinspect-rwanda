-- Test query to check all data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Facilities', COUNT(*) FROM facilities
UNION ALL
SELECT 'Inspections', COUNT(*) FROM inspections
UNION ALL
SELECT 'Inspection Items', COUNT(*) FROM inspection_items
UNION ALL
SELECT 'Corrective Actions', COUNT(*) FROM corrective_actions
UNION ALL
SELECT 'Inspection Categories', COUNT(*) FROM inspection_categories;

-- Show user roles
SELECT name, role, district FROM users ORDER BY role, name;

-- Show facilities by type
SELECT type, COUNT(*) as count FROM facilities GROUP BY type;

-- Show recent inspections
SELECT 
  i.date,
  f.name as facility_name,
  f.type as facility_type,
  u.name as inspector_name,
  u.role as inspector_role,
  i.status,
  i.score
FROM inspections i
JOIN facilities f ON i.facility_id = f.id
JOIN users u ON i.inspector_id = u.id
ORDER BY i.date DESC;

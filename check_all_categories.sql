-- Ver todas las categorías actuales en la base de datos
SELECT 
  id,
  name,
  icon,
  color,
  is_active,
  sort_order,
  created_at
FROM course_categories 
ORDER BY created_at DESC;

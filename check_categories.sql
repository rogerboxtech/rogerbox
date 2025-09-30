-- Ver todas las categorías en la base de datos
SELECT 
  id,
  name,
  description,
  created_at
FROM course_categories 
ORDER BY name;

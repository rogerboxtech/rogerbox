-- Eliminar todas las categorías excepto las 5 específicas de RogerBox
DELETE FROM course_categories 
WHERE name NOT IN (
  'HIIT Avanzado',
  'Complementos', 
  'Entrenamientos Express',
  'Cardio Intenso',
  'Transformación Avanzada'
);

-- Verificar que solo quedaron las 5 categorías
SELECT id, name, icon, color, is_active, sort_order 
FROM course_categories 
ORDER BY sort_order;

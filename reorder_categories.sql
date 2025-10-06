-- Reordenar categorías: Quema de Grasa primero
UPDATE course_categories 
SET sort_order = 1
WHERE name = 'Quema de Grasa';

-- Ajustar el orden de las demás
UPDATE course_categories 
SET sort_order = 2
WHERE name = 'HIIT Avanzado';

UPDATE course_categories 
SET sort_order = 3
WHERE name = 'Complementos';

UPDATE course_categories 
SET sort_order = 4
WHERE name = 'Entrenamientos Express';

UPDATE course_categories 
SET sort_order = 5
WHERE name = 'Cardio Intenso';

-- Verificar el nuevo orden
SELECT 
  name,
  icon,
  color,
  sort_order
FROM course_categories 
ORDER BY sort_order;

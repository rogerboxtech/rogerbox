-- Actualizar "Transformación Avanzada" por "Quema de Grasa"
UPDATE course_categories 
SET 
  name = 'Quema de Grasa',
  description = 'Programa completo de quema de grasa y transformación corporal',
  icon = '🔥',
  color = '#ff6348'
WHERE name = 'Transformación Avanzada';

-- Verificar el cambio
SELECT 
  id,
  name,
  description,
  icon,
  color,
  is_active,
  sort_order
FROM course_categories 
ORDER BY sort_order;

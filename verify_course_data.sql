-- Verificar que los datos del curso están seguros
SELECT id, title, price, discount_percentage, category, duration_days, calories_burned, level, is_published
FROM courses 
ORDER BY created_at DESC 
LIMIT 5;

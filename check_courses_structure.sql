-- Verificar estructura completa de la tabla courses
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY column_name;

-- Verificar si hay datos en la tabla courses
SELECT COUNT(*) as total_courses FROM courses;

-- Verificar datos específicos de un curso si existe
SELECT id, title, price, discount_percentage, include_iva, iva_percentage 
FROM courses 
LIMIT 3;

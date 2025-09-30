-- Verificar si la tabla courses existe y tiene datos
SELECT COUNT(*) as total_courses FROM courses;

-- Verificar estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY column_name;

-- Verificar si hay datos en otras tablas relacionadas
SELECT COUNT(*) as total_lessons FROM course_lessons;
SELECT COUNT(*) as total_categories FROM categories;

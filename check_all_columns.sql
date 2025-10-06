-- Verificar TODAS las columnas de la tabla courses
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY column_name;

-- Contar total de columnas
SELECT COUNT(*) as total_columns FROM information_schema.columns 
WHERE table_name = 'courses';

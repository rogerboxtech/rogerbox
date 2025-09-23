-- Agregar la columna lesson_order que falta en la tabla course_lessons
ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS lesson_order INTEGER DEFAULT 1;

-- Verificar la estructura de la tabla course_lessons
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'course_lessons' 
ORDER BY ordinal_position;

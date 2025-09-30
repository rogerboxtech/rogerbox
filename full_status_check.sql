-- Verificación completa del estado de la base de datos
SELECT 'CURSOS:' as tabla, COUNT(*) as cantidad FROM courses
UNION ALL
SELECT 'LECCIONES:', COUNT(*) FROM course_lessons  
UNION ALL
SELECT 'CATEGORIAS:', COUNT(*) FROM categories
UNION ALL
SELECT 'PERFILES:', COUNT(*) FROM profiles
UNION ALL
SELECT 'CALIFICACIONES:', COUNT(*) FROM course_ratings
UNION ALL
SELECT 'INSCRIPCIONES:', COUNT(*) FROM course_enrollments;

-- Verificar si hay cursos específicos
SELECT 'Cursos existentes:' as info;
SELECT id, title, price, is_published FROM courses LIMIT 5;

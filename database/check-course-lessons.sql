-- Verificar datos en la tabla course_lessons
SELECT 
    cl.*,
    c.title as course_title
FROM course_lessons cl
JOIN courses c ON cl.course_id = c.id
ORDER BY cl.course_id, cl.lesson_order
LIMIT 10;

-- Script de emergencia para recuperar datos de RogerBox
-- SOLO EJECUTAR SI LOS DATOS SE PERDIERON

-- 1. Verificar estado actual
SELECT 'Estado actual de la base de datos:' as status;
SELECT COUNT(*) as total_courses FROM courses;
SELECT COUNT(*) as total_lessons FROM course_lessons;
SELECT COUNT(*) as total_categories FROM categories;

-- 2. Si no hay datos, recrear con datos de ejemplo
INSERT INTO categories (name, description) VALUES
('Bajar de peso', 'Cursos enfocados en pérdida de peso'),
('Tonificar', 'Cursos para tonificar y definir músculos'),
('Cardio', 'Cursos de ejercicios cardiovasculares'),
('Flexibilidad', 'Cursos de estiramiento y flexibilidad'),
('Fuerza', 'Cursos de entrenamiento de fuerza')
ON CONFLICT (name) DO NOTHING;

-- 3. Crear curso de ejemplo
INSERT INTO courses (
  title, 
  short_description, 
  description, 
  price, 
  discount_percentage, 
  category, 
  duration_days, 
  calories_burned, 
  level, 
  is_published,
  include_iva,
  iva_percentage
) VALUES (
  'FULL BODY EXPRESS',
  '¡ENTRENA 12 MINUTOS EN VACACIONES!',
  'Un entrenamiento completo de 12 minutos que puedes hacer en cualquier lugar. Perfecto para mantenerte activo durante las vacaciones.',
  76000,
  35,
  (SELECT id FROM categories WHERE name = 'Bajar de peso' LIMIT 1),
  15,
  300,
  'intermediate',
  true,
  true,
  19
);

-- 4. Verificar que se creó correctamente
SELECT 'Curso de ejemplo creado:' as status;
SELECT id, title, price, include_iva, iva_percentage FROM courses;


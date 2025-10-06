-- Crear las 5 categorías específicas de RogerBox
INSERT INTO course_categories (id, name, description, icon, color, is_active, sort_order) VALUES
  (gen_random_uuid(), 'HIIT Avanzado', 'Entrenamientos de alta intensidad para resultados rápidos', '⚡', '#ff6b35', true, 1),
  (gen_random_uuid(), 'Complementos', 'Suplementos y complementos para optimizar tu rendimiento', '💊', '#ff4757', true, 2),
  (gen_random_uuid(), 'Entrenamientos Express', 'Sesiones cortas pero efectivas para días ocupados', '🚀', '#ffa502', true, 3),
  (gen_random_uuid(), 'Cardio Intenso', 'Cardio de alta intensidad para quemar grasa', '🔥', '#ff6348', true, 4),
  (gen_random_uuid(), 'Transformación Avanzada', 'Programa completo de quema de grasa y transformación', '🎯', '#85ea10', true, 5);

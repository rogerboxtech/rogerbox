-- Solución DEFINITIVA para el caché de Supabase
-- 1. Forzar recarga del esquema
NOTIFY pgrst, 'reload schema';

-- 2. Esperar 10 segundos y verificar que las columnas existen
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('include_iva', 'iva_percentage')
ORDER BY column_name;

-- 3. Probar insertar un curso con IVA para verificar que funciona
INSERT INTO courses (
  title, 
  short_description, 
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
  'Curso Test IVA',
  'Prueba de IVA',
  100000,
  20,
  (SELECT id FROM categories LIMIT 1),
  30,
  250,
  'intermediate',
  false,
  true,
  19
) RETURNING id, title, include_iva, iva_percentage;

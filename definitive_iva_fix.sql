-- Solución DEFINITIVA para crear las columnas de IVA
-- 1. Verificar si las columnas existen
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('include_iva', 'iva_percentage');

-- 2. Si no existen, crearlas con un enfoque diferente
DO $$
BEGIN
    -- Crear include_iva si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'include_iva'
    ) THEN
        ALTER TABLE courses ADD COLUMN include_iva BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna include_iva creada';
    ELSE
        RAISE NOTICE 'Columna include_iva ya existe';
    END IF;
    
    -- Crear iva_percentage si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'iva_percentage'
    ) THEN
        ALTER TABLE courses ADD COLUMN iva_percentage INTEGER DEFAULT 19;
        RAISE NOTICE 'Columna iva_percentage creada';
    ELSE
        RAISE NOTICE 'Columna iva_percentage ya existe';
    END IF;
END
$$;

-- 3. Verificar que se crearon correctamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('include_iva', 'iva_percentage')
ORDER BY column_name;

-- 4. Probar insertar un curso de prueba
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
  'Curso de Prueba',
  'Descripción de prueba',
  50000,
  10,
  (SELECT id FROM categories LIMIT 1),
  30,
  200,
  'beginner',
  false,
  true,
  19
) RETURNING id, title, include_iva, iva_percentage;

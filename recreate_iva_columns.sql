-- Solución definitiva: Eliminar y recrear las columnas
-- 1. Eliminar las columnas existentes
ALTER TABLE courses DROP COLUMN IF EXISTS include_iva;
ALTER TABLE courses DROP COLUMN IF EXISTS iva_percentage;

-- 2. Recrear las columnas
ALTER TABLE courses 
ADD COLUMN include_iva BOOLEAN DEFAULT FALSE,
ADD COLUMN iva_percentage INTEGER DEFAULT 19;

-- 3. Verificar que se crearon correctamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('include_iva', 'iva_percentage')
ORDER BY column_name;

-- 4. Forzar recarga del esquema
NOTIFY pgrst, 'reload schema';

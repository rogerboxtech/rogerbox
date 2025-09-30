-- Solución alternativa: Verificar el estado actual y forzar cambios
-- 1. Verificar si las columnas existen
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY column_name;

-- 2. Si no existen, crearlas directamente
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'include_iva'
    ) THEN
        ALTER TABLE courses ADD COLUMN include_iva BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'iva_percentage'
    ) THEN
        ALTER TABLE courses ADD COLUMN iva_percentage INTEGER DEFAULT 19;
    END IF;
END
$$;

-- 3. Verificar resultado final
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('include_iva', 'iva_percentage')
ORDER BY column_name;

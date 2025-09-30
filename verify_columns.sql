-- Verificar que las columnas existen
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('include_iva', 'iva_percentage')
ORDER BY column_name;

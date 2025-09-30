-- Script para agregar columnas de IVA a la tabla courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS include_iva BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS iva_percentage INTEGER DEFAULT 19;

-- Verificar que se crearon las columnas
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('include_iva', 'iva_percentage');

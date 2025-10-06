-- Verificar si existe la columna intro_video_url en la tabla courses
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name = 'intro_video_url';

-- Si no existe, crearla
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS intro_video_url TEXT;

-- Verificar que se creó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name = 'intro_video_url';

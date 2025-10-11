-- Script para agregar campo mux_playback_id a la tabla courses
-- Ejecutar en Supabase SQL Editor

-- Agregar campo mux_playback_id a la tabla courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS mux_playback_id TEXT;

-- Agregar comentario para documentar el campo
COMMENT ON COLUMN courses.mux_playback_id IS 'Mux Playback ID para reproducir videos de alta calidad';

-- Crear índice para búsquedas rápidas por playback ID
CREATE INDEX IF NOT EXISTS idx_courses_mux_playback_id ON courses(mux_playback_id);

-- Verificar que el campo se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name = 'mux_playback_id';

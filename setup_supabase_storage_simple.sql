-- Script SQL ULTRA SIMPLE para Supabase Storage
-- 1. Crear bucket para imágenes de cursos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  5242880, -- 5MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 2. Crear bucket para imágenes de lecciones
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-images',
  'lesson-images',
  true,
  5242880, -- 5MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 3. Verificar que los buckets se crearon correctamente
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id IN ('course-images', 'lesson-images');

-- 4. Las políticas RLS se pueden crear manualmente desde la interfaz de Supabase
-- O ejecutar este comando para habilitar RLS en storage.objects:
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

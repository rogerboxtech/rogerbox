-- Script SQL FINAL para Supabase Storage (sin IF NOT EXISTS)
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

-- 3. Eliminar políticas existentes si existen (para evitar conflictos)
DROP POLICY IF EXISTS 'Public Access' ON storage.objects;
DROP POLICY IF EXISTS 'Authenticated users can upload' ON storage.objects;
DROP POLICY IF EXISTS 'Authenticated users can update' ON storage.objects;
DROP POLICY IF EXISTS 'Authenticated users can delete' ON storage.objects;

-- 4. Crear políticas RLS para storage.objects
-- Política para acceso público de lectura
CREATE POLICY 'Public Access' ON storage.objects
FOR SELECT USING (bucket_id IN ('course-images', 'lesson-images'));

-- Política para subida de imágenes (usuarios autenticados)
CREATE POLICY 'Authenticated users can upload' ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

-- Política para actualización de imágenes (usuarios autenticados)
CREATE POLICY 'Authenticated users can update' ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

-- Política para eliminación de imágenes (usuarios autenticados)
CREATE POLICY 'Authenticated users can delete' ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

-- 5. Verificar que los buckets se crearon correctamente
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id IN ('course-images', 'lesson-images');

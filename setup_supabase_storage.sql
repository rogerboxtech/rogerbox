-- Crear buckets de Storage en Supabase
-- 1. Crear bucket para imágenes de cursos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  5242880, -- 5MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 2. Crear bucket para imágenes de lecciones
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-images',
  'lesson-images',
  true,
  5242880, -- 5MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 3. Crear políticas RLS para permitir acceso público a las imágenes
CREATE POLICY 'Public Access' ON storage.objects
FOR SELECT USING (bucket_id IN ('course-images', 'lesson-images'));

-- 4. Crear política para permitir subida de imágenes (solo usuarios autenticados)
CREATE POLICY 'Authenticated users can upload' ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

-- 5. Crear política para permitir actualización de imágenes (solo usuarios autenticados)
CREATE POLICY 'Authenticated users can update' ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

-- 6. Crear política para permitir eliminación de imágenes (solo usuarios autenticados)
CREATE POLICY 'Authenticated users can delete' ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

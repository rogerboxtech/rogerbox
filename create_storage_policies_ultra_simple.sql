-- Script ULTRA SIMPLE para políticas RLS (SIN DROP)
-- 1. Habilitar RLS en storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Crear política para acceso público de lectura
CREATE POLICY "Enable read access for public" ON storage.objects
FOR SELECT USING (bucket_id IN ('course-images', 'lesson-images'));

-- 3. Crear política para subida de archivos (usuarios autenticados)
CREATE POLICY "Enable insert for authenticated users" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

-- 4. Crear política para actualización de archivos (usuarios autenticados)
CREATE POLICY "Enable update for authenticated users" ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

-- 5. Crear política para eliminación de archivos (usuarios autenticados)
CREATE POLICY "Enable delete for authenticated users" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('course-images', 'lesson-images')
);

-- 6. Verificar que las políticas se crearon
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

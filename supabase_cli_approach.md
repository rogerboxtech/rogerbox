-- Alternativa: Crear políticas usando Supabase CLI
-- Si tienes Supabase CLI instalado, puedes usar:

-- 1. Instalar Supabase CLI (si no lo tienes):
-- npm install -g supabase

-- 2. Login en Supabase:
-- supabase login

-- 3. Link tu proyecto:
-- supabase link --project-ref [tu-project-ref]

-- 4. Crear archivo de migración:
-- supabase migration new create_storage_policies

-- 5. En el archivo de migración, agregar:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for public" ON storage.objects FOR SELECT USING (bucket_id IN ('course-images', 'lesson-images'));
-- CREATE POLICY "Enable insert for authenticated users" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id IN ('course-images', 'lesson-images'));
-- CREATE POLICY "Enable update for authenticated users" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated' AND bucket_id IN ('course-images', 'lesson-images'));
-- CREATE POLICY "Enable delete for authenticated users" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated' AND bucket_id IN ('course-images', 'lesson-images'));

-- 6. Aplicar migración:
-- supabase db push

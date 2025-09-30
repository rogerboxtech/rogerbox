-- Alternativa: Deshabilitar RLS temporalmente para probar
-- (Solo para testing, NO para producción)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

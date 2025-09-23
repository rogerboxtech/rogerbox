-- Verificar si la tabla existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_complement_notes';

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view their own notes" ON user_complement_notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON user_complement_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON user_complement_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON user_complement_notes;

-- Crear políticas de RLS más simples
CREATE POLICY "Enable all operations for authenticated users" ON user_complement_notes
  FOR ALL USING (auth.uid() = user_id);

-- Verificar que RLS esté habilitado
ALTER TABLE user_complement_notes ENABLE ROW LEVEL SECURITY;

-- Verificar las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_complement_notes';

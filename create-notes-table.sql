-- Crear tabla para notas múltiples
CREATE TABLE user_complement_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  complement_id UUID REFERENCES complements(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_user_complement_notes_user_id ON user_complement_notes(user_id);
CREATE INDEX idx_user_complement_notes_complement_id ON user_complement_notes(complement_id);
CREATE INDEX idx_user_complement_notes_created_at ON user_complement_notes(created_at DESC);

-- Habilitar RLS
ALTER TABLE user_complement_notes ENABLE ROW LEVEL SECURITY;

-- Crear política de RLS
CREATE POLICY "Users can view their own notes" ON user_complement_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON user_complement_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON user_complement_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON user_complement_notes
  FOR DELETE USING (auth.uid() = user_id);

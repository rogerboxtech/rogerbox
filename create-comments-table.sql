-- Crear tabla para comentarios múltiples
CREATE TABLE user_complement_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  complement_id UUID REFERENCES complements(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_user_complement_comments_user_id ON user_complement_comments(user_id);
CREATE INDEX idx_user_complement_comments_complement_id ON user_complement_comments(complement_id);
CREATE INDEX idx_user_complement_comments_created_at ON user_complement_comments(created_at DESC);

-- Habilitar RLS
ALTER TABLE user_complement_comments ENABLE ROW LEVEL SECURITY;

-- Crear política de RLS
CREATE POLICY "Users can view their own comments" ON user_complement_comments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comments" ON user_complement_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON user_complement_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON user_complement_comments
  FOR DELETE USING (auth.uid() = user_id);

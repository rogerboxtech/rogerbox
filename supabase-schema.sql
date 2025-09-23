-- Tabla de complementos (creada por admin)
CREATE TABLE IF NOT EXISTS complements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  duration INTEGER, -- en minutos
  category VARCHAR(100),
  difficulty VARCHAR(50) CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado')),
  instructor VARCHAR(100) DEFAULT 'RogerBox',
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  recommended_for TEXT[], -- Array de tags de recomendación
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de interacciones del usuario con complementos
CREATE TABLE IF NOT EXISTS user_complement_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  complement_id UUID REFERENCES complements(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  is_completed BOOLEAN DEFAULT false,
  times_completed INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  personal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, complement_id)
);

-- Tabla de estadísticas agregadas de complementos
CREATE TABLE IF NOT EXISTS complement_stats (
  complement_id UUID PRIMARY KEY REFERENCES complements(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  total_favorites INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_user_complement_interactions_user_id ON user_complement_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_complement_interactions_complement_id ON user_complement_interactions(complement_id);
CREATE INDEX IF NOT EXISTS idx_complements_category ON complements(category);
CREATE INDEX IF NOT EXISTS idx_complements_difficulty ON complements(difficulty);
CREATE INDEX IF NOT EXISTS idx_complements_is_active ON complements(is_active);

-- Función para actualizar estadísticas automáticamente
CREATE OR REPLACE FUNCTION update_complement_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar estadísticas cuando cambian las interacciones
  INSERT INTO complement_stats (complement_id, total_favorites, average_rating, total_ratings)
  SELECT 
    NEW.complement_id,
    COUNT(CASE WHEN is_favorite = true THEN 1 END),
    COALESCE(AVG(user_rating), 0),
    COUNT(CASE WHEN user_rating IS NOT NULL THEN 1 END)
  FROM user_complement_interactions 
  WHERE complement_id = NEW.complement_id
  ON CONFLICT (complement_id) 
  DO UPDATE SET
    total_favorites = EXCLUDED.total_favorites,
    average_rating = EXCLUDED.average_rating,
    total_ratings = EXCLUDED.total_ratings,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estadísticas automáticamente
CREATE TRIGGER trigger_update_complement_stats
  AFTER INSERT OR UPDATE OR DELETE ON user_complement_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_complement_stats();

-- RLS (Row Level Security)
ALTER TABLE complements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_complement_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE complement_stats ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para complements (todos pueden leer, solo admins pueden escribir)
CREATE POLICY "Complements are viewable by everyone" ON complements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Complements are editable by admins" ON complements
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas RLS para user_complement_interactions (usuarios solo pueden ver sus propias interacciones)
CREATE POLICY "Users can view their own interactions" ON user_complement_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own interactions" ON user_complement_interactions
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para complement_stats (todos pueden leer)
CREATE POLICY "Stats are viewable by everyone" ON complement_stats
  FOR SELECT USING (true);

-- Insertar algunos complementos de ejemplo
INSERT INTO complements (title, description, video_url, duration, category, difficulty, is_new, recommended_for) VALUES
('Estiramiento Matutino', 'Rutina de 10 minutos para empezar el día con energía y flexibilidad', 'https://player.vimeo.com/video/1120425801', 10, 'Flexibilidad', 'Principiante', true, ARRAY['Principiante', 'Flexibilidad', 'Mañana']),
('Respiración Profunda', 'Técnicas de respiración para relajación y concentración', 'https://player.vimeo.com/video/1120425801', 8, 'Relajación', 'Principiante', false, ARRAY['Principiante', 'Relajación', 'Estrés']),
('Calentamiento Dinámico', 'Prepara tu cuerpo antes de cualquier entrenamiento', 'https://player.vimeo.com/video/1120425801', 12, 'Calentamiento', 'Intermedio', false, ARRAY['Intermedio', 'Calentamiento', 'Pre-entreno']);

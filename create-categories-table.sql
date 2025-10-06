-- Crear tabla para categorías de cursos
CREATE TABLE IF NOT EXISTS course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) NOT NULL, -- emoji
  color VARCHAR(7) DEFAULT '#85ea10', -- color hex
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorías
CREATE POLICY "Anyone can view active categories" ON course_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON course_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

-- Insertar categorías iniciales enfocadas en transformación corporal
INSERT INTO course_categories (name, description, icon, color, sort_order) VALUES
('Transformación Intensa', 'Entrenamientos de alta intensidad para transformar tu cuerpo', '🔥', '#ff6b35', 1),
('HIIT Avanzado', 'High Intensity Interval Training para máxima efectividad', '⚡', '#ff4757', 2),
('Cardio Intenso', 'Ejercicios cardiovasculares para quemar calorías', '🏃', '#ffa502', 3),
('Fuerza Funcional', 'Entrenamiento de fuerza que acelera la transformación', '💪', '#ff6348', 4),
('Entrenamiento en Casa', 'Rutinas efectivas sin equipos', '🏠', '#ff9ff3', 5),
('Rutina Matutina', 'Ejercicios matutinos para activar el metabolismo', '🌅', '#ffd700', 6),
('Sesión Nocturna', 'Rutinas nocturnas para maximizar resultados', '🌙', '#4834d4', 7),
('Entrenamiento Express', 'Rutinas cortas pero intensas', '⚡', '#ff3838', 8),
('Complementos', 'Suplementos, tips y consejos para potenciar tu entrenamiento', '💊', '#2ed573', 9);

-- Crear índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_course_categories_sort_order ON course_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_course_categories_is_active ON course_categories(is_active);

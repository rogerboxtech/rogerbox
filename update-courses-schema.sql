-- Actualizar la tabla courses con todos los campos necesarios
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS short_description VARCHAR(500),
ADD COLUMN IF NOT EXISTS preview_image TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category VARCHAR(100) NOT NULL DEFAULT 'general',
ADD COLUMN IF NOT EXISTS duration_days INTEGER NOT NULL DEFAULT 30,
ADD COLUMN IF NOT EXISTS students_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS calories_burned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS intro_video_url TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Actualizar la tabla course_lessons con campos adicionales
ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS preview_image TEXT,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear tabla para certificados de finalización
CREATE TABLE IF NOT EXISTS course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificate_url TEXT,
  shareable_code VARCHAR(50) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para estadísticas de clases
CREATE TABLE IF NOT EXISTS lesson_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  views_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_lesson_order ON course_lessons(lesson_order);
CREATE INDEX IF NOT EXISTS idx_course_certificates_course_id ON course_certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_user_id ON course_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_stats_lesson_id ON lesson_stats(lesson_id);

-- Habilitar RLS
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_stats ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para certificados
CREATE POLICY "Users can view own certificates" ON course_certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage certificates" ON course_certificates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

-- Políticas RLS para estadísticas de clases
CREATE POLICY "Anyone can view lesson stats" ON lesson_stats
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage lesson stats" ON lesson_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

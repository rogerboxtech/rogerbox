-- Script completo para crear la base de datos de RogerBox
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  short_description TEXT,
  description TEXT,
  preview_image TEXT,
  price INTEGER NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  category UUID REFERENCES categories(id),
  duration_days INTEGER,
  students_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  calories_burned INTEGER,
  level VARCHAR(50),
  is_published BOOLEAN DEFAULT FALSE,
  include_iva BOOLEAN DEFAULT FALSE,
  iva_percentage INTEGER DEFAULT 19,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de lecciones
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  video_url TEXT,
  preview_image TEXT,
  lesson_number INTEGER NOT NULL,
  lesson_order INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  goals TEXT,
  activity_level VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear tabla de calificaciones de cursos
CREATE TABLE IF NOT EXISTS course_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- 6. Crear tabla de inscripciones
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(course_id, user_id)
);

-- 7. Insertar categorías de ejemplo
INSERT INTO categories (name, description) VALUES
('Bajar de peso', 'Cursos enfocados en pérdida de peso'),
('Tonificar', 'Cursos para tonificar y definir músculos'),
('Cardio', 'Cursos de ejercicios cardiovasculares'),
('Flexibilidad', 'Cursos de estiramiento y flexibilidad'),
('Fuerza', 'Cursos de entrenamiento de fuerza')
ON CONFLICT (name) DO NOTHING;

-- 8. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_course_id ON course_ratings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);

-- 9. Habilitar RLS (Row Level Security)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- 10. Crear políticas RLS básicas
-- Cursos públicos (todos pueden leer)
CREATE POLICY "Cursos públicos son visibles para todos" ON courses
  FOR SELECT USING (is_published = true);

-- Perfiles (usuarios solo pueden ver/editar el suyo)
CREATE POLICY "Usuarios pueden ver su propio perfil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Calificaciones (usuarios pueden crear/ver las suyas)
CREATE POLICY "Usuarios pueden crear calificaciones" ON course_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden ver sus calificaciones" ON course_ratings
  FOR SELECT USING (auth.uid() = user_id);

-- Inscripciones (usuarios pueden ver/crear las suyas)
CREATE POLICY "Usuarios pueden ver sus inscripciones" ON course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden inscribirse a cursos" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11. Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Crear triggers para updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Crear función para actualizar rating promedio
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses 
  SET rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM course_ratings 
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
  )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 14. Crear trigger para actualizar rating
CREATE TRIGGER update_rating_on_rating_change
  AFTER INSERT OR UPDATE OR DELETE ON course_ratings
  FOR EACH ROW EXECUTE FUNCTION update_course_rating();

-- 15. Crear función para actualizar students_count
CREATE OR REPLACE FUNCTION update_students_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses 
  SET students_count = (
    SELECT COUNT(*)
    FROM course_enrollments 
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
  )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 16. Crear trigger para actualizar students_count
CREATE TRIGGER update_students_count_on_enrollment
  AFTER INSERT OR DELETE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_students_count();

-- 17. Verificar que todo se creó correctamente
SELECT 'Tablas creadas exitosamente' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;


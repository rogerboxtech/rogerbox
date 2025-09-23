-- Crear tabla para calificaciones de cursos
CREATE TABLE IF NOT EXISTS course_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id) -- Un usuario solo puede calificar un curso una vez
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_course_ratings_course_id ON course_ratings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_user_id ON course_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_created_at ON course_ratings(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver todas las calificaciones
CREATE POLICY "Anyone can view course ratings" ON course_ratings
  FOR SELECT USING (true);

-- Política para que los usuarios autenticados puedan insertar sus propias calificaciones
CREATE POLICY "Authenticated users can insert their own ratings" ON course_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar sus propias calificaciones
CREATE POLICY "Users can update their own ratings" ON course_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para que los usuarios puedan eliminar sus propias calificaciones
CREATE POLICY "Users can delete their own ratings" ON course_ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_course_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_course_ratings_updated_at
  BEFORE UPDATE ON course_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_course_ratings_updated_at();

-- Función para calcular el promedio de calificaciones de un curso
CREATE OR REPLACE FUNCTION calculate_course_rating_avg(course_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating
  FROM course_ratings
  WHERE course_id = course_uuid;
  
  RETURN ROUND(avg_rating, 1);
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar automáticamente el rating del curso cuando se agrega una calificación
CREATE OR REPLACE FUNCTION update_course_rating_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses 
  SET rating = calculate_course_rating_avg(NEW.course_id)
  WHERE id = NEW.course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el rating del curso automáticamente
CREATE TRIGGER update_course_rating_trigger
  AFTER INSERT ON course_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating_on_insert();

-- Función para actualizar el rating del curso cuando se actualiza una calificación
CREATE OR REPLACE FUNCTION update_course_rating_on_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses 
  SET rating = calculate_course_rating_avg(NEW.course_id)
  WHERE id = NEW.course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el rating del curso cuando se actualiza una calificación
CREATE TRIGGER update_course_rating_on_update_trigger
  AFTER UPDATE ON course_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating_on_update();

-- Función para actualizar el rating del curso cuando se elimina una calificación
CREATE OR REPLACE FUNCTION update_course_rating_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses 
  SET rating = calculate_course_rating_avg(OLD.course_id)
  WHERE id = OLD.course_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el rating del curso cuando se elimina una calificación
CREATE TRIGGER update_course_rating_on_delete_trigger
  AFTER DELETE ON course_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating_on_delete();

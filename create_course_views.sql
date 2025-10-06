-- Crear tabla para trackear visitas de cursos
CREATE TABLE IF NOT EXISTS course_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_course_views_course_id ON course_views(course_id);
CREATE INDEX IF NOT EXISTS idx_course_views_viewed_at ON course_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_course_views_user_id ON course_views(user_id);

-- Función para obtener el curso más visitado
CREATE OR REPLACE FUNCTION get_most_viewed_course()
RETURNS UUID AS $$
DECLARE
  most_viewed_course_id UUID;
BEGIN
  SELECT course_id INTO most_viewed_course_id
  FROM course_views
  WHERE viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY course_id
  ORDER BY COUNT(*) DESC
  LIMIT 1;
  
  RETURN most_viewed_course_id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el conteo de visitas de un curso
CREATE OR REPLACE FUNCTION get_course_view_count(course_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  view_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO view_count
  FROM course_views
  WHERE course_id = course_uuid
  AND viewed_at >= NOW() - INTERVAL '30 days';
  
  RETURN COALESCE(view_count, 0);
END;
$$ LANGUAGE plpgsql;

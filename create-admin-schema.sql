-- Crear tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'super_admin', 'admin', 'moderator'
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  category VARCHAR(100) NOT NULL, -- 'weight_loss', 'hiit', 'strength', 'cardio', 'toning', 'muscle'
  level VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  duration_days INTEGER NOT NULL, -- Duración del curso en días
  price DECIMAL(10,2) NOT NULL,
  thumbnail_url VARCHAR(500),
  video_preview_url VARCHAR(500),
  instructor VARCHAR(255) DEFAULT 'RogerBox',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de clases del curso
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL, -- Número de la clase (1, 2, 3...)
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  duration_minutes INTEGER,
  is_preview BOOLEAN DEFAULT false, -- Si es una clase de preview
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, lesson_number)
);

-- Crear tabla de compras de cursos
CREATE TABLE IF NOT EXISTS course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date TIMESTAMP WITH TIME ZONE, -- Fecha cuando el usuario quiere empezar
  end_date TIMESTAMP WITH TIME ZONE, -- Fecha de finalización (start_date + duration_days)
  price_paid DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de progreso de usuarios en cursos
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES course_purchases(id) ON DELETE CASCADE,
  current_lesson INTEGER DEFAULT 1,
  completed_lessons INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Crear tabla de licencias empresariales
CREATE TABLE IF NOT EXISTS enterprise_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  license_type VARCHAR(50) NOT NULL, -- 'basic', 'premium', 'enterprise'
  max_users INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de usuarios empresariales
CREATE TABLE IF NOT EXISTS enterprise_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES enterprise_licenses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id VARCHAR(100), -- ID interno de la empresa
  department VARCHAR(100),
  position VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(license_id, user_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_course_lessons_course_id ON course_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_user_id ON course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_course_id ON course_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_licenses_is_active ON enterprise_licenses(is_active);
CREATE INDEX IF NOT EXISTS idx_enterprise_users_license_id ON enterprise_users(license_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_users ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para admins (solo super admins pueden ver todo)
CREATE POLICY "Admins can view all admins" ON admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() 
      AND a.role = 'super_admin' 
      AND a.is_active = true
    )
  );

-- Políticas para cursos (todos pueden ver cursos activos)
CREATE POLICY "Anyone can view active courses" ON courses
  FOR SELECT USING (is_active = true);

-- Políticas para admins (solo admins pueden modificar cursos)
CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
    )
  );

-- Políticas para compras (usuarios solo pueden ver sus propias compras)
CREATE POLICY "Users can view own purchases" ON course_purchases
  FOR SELECT USING (user_id = auth.uid());

-- Políticas para progreso (usuarios solo pueden ver su propio progreso)
CREATE POLICY "Users can view own progress" ON user_course_progress
  FOR ALL USING (user_id = auth.uid());

-- Insertar el super admin por defecto
INSERT INTO admins (user_id, email, name, role, permissions, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- ID fijo para el super admin
  'rogerboxtech@gmail.com',
  'Roger Barreto',
  'super_admin',
  '{"all": true, "users": true, "courses": true, "enterprise": true, "analytics": true}',
  true
) ON CONFLICT (email) DO NOTHING;

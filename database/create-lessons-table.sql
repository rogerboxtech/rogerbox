-- Crear tabla lessons
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    duration INTEGER, -- duración en minutos
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(course_id, order_index);

-- Habilitar RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios autenticados
CREATE POLICY "Allow authenticated users to read lessons" ON public.lessons
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir inserción/actualización solo a administradores
CREATE POLICY "Allow admins to manage lessons" ON public.lessons
    FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

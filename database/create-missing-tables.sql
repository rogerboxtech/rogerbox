-- Script para crear todas las tablas faltantes
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla lessons
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

-- 2. Crear tabla user_favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 3. Crear tabla course_purchases
CREATE TABLE IF NOT EXISTS public.course_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Crear índices para lessons
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(course_id, order_index);

-- Crear índices para user_favorites
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_course_id ON public.user_favorites(course_id);

-- Crear índices para course_purchases
CREATE INDEX IF NOT EXISTS idx_course_purchases_user_id ON public.course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_course_id ON public.course_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_order_id ON public.course_purchases(order_id);

-- Habilitar RLS para todas las tablas
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;

-- Políticas para lessons
CREATE POLICY "Allow authenticated users to read lessons" ON public.lessons
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage lessons" ON public.lessons
    FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Políticas para user_favorites
CREATE POLICY "Users can view their own favorites" ON public.user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para course_purchases
CREATE POLICY "Users can view their own purchases" ON public.course_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow purchase creation" ON public.course_purchases
    FOR INSERT WITH CHECK (true);

-- Crear tabla course_purchases si no existe
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

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_course_purchases_user_id ON public.course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_course_id ON public.course_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_order_id ON public.course_purchases(order_id);

-- Habilitar RLS
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;

-- Política para permitir a usuarios ver sus propias compras
CREATE POLICY "Users can view their own purchases" ON public.course_purchases
    FOR SELECT USING (auth.uid() = user_id);

-- Política para permitir inserción de compras (usado por webhook)
CREATE POLICY "Allow purchase creation" ON public.course_purchases
    FOR INSERT WITH CHECK (true);

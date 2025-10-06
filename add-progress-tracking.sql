-- Agregar campos para seguimiento de progreso en la tabla profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_weight INTEGER,
ADD COLUMN IF NOT EXISTS weight_progress_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_weight_update DATE,
ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_class_date DATE;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_current_weight ON profiles(current_weight);
CREATE INDEX IF NOT EXISTS idx_profiles_weight_progress ON profiles(weight_progress_percentage);
CREATE INDEX IF NOT EXISTS idx_profiles_streak_days ON profiles(streak_days);

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('current_weight', 'weight_progress_percentage', 'last_weight_update', 'streak_days', 'last_class_date');

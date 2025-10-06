-- Agregar columnas para metas de peso a la tabla profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS target_weight INTEGER,
ADD COLUMN IF NOT EXISTS goal_deadline DATE;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_target_weight ON profiles(target_weight);
CREATE INDEX IF NOT EXISTS idx_profiles_goal_deadline ON profiles(goal_deadline);

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('target_weight', 'goal_deadline');

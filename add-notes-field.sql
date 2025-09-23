-- Agregar campo para notas múltiples a la tabla existente
ALTER TABLE user_complement_interactions 
ADD COLUMN IF NOT EXISTS notes_array JSONB DEFAULT '[]'::jsonb;

-- Crear índice para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_user_complement_interactions_notes_array 
ON user_complement_interactions USING GIN (notes_array);

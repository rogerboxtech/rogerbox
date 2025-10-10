-- Agregar campos de descuento a la tabla courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;

-- Actualizar cursos existentes con datos de ejemplo
UPDATE courses 
SET 
  original_price = CASE 
    WHEN price > 50000 THEN price * 1.2  -- 20% más caro como precio original
    ELSE price * 1.1  -- 10% más caro como precio original
  END,
  discount_percentage = CASE 
    WHEN price > 50000 THEN 17  -- 17% de descuento
    ELSE 9  -- 9% de descuento
  END
WHERE original_price IS NULL;

-- Verificar los datos actualizados
SELECT 
  id,
  title,
  price,
  original_price,
  discount_percentage,
  ROUND(((original_price - price) / original_price) * 100) as calculated_discount
FROM courses 
LIMIT 5;

-- Agregar columna metadata a la tabla orders
ALTER TABLE orders ADD COLUMN metadata JSONB;

-- Crear índice para mejor rendimiento en consultas JSONB
CREATE INDEX IF NOT EXISTS idx_orders_metadata ON orders USING GIN (metadata);

-- Comentario para documentar el uso de la columna
COMMENT ON COLUMN orders.metadata IS 'Metadatos adicionales del pedido (precios originales, descuentos, etc.)';

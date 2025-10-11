-- =============================================
-- WOMPI PAYMENT INTEGRATION SCHEMA
-- =============================================

-- Tabla de órdenes de pago
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Información de la orden
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'error', 'cancelled')),
  
  -- Información de Wompi
  wompi_transaction_id VARCHAR(255) UNIQUE,
  wompi_reference VARCHAR(255) UNIQUE,
  payment_method VARCHAR(50),
  payment_source_id VARCHAR(255),
  
  -- Metadatos
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  redirect_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 minutes')
);

-- Tabla de transacciones Wompi (log detallado)
CREATE TABLE IF NOT EXISTS wompi_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  -- IDs de Wompi
  wompi_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  wompi_reference VARCHAR(255),
  
  -- Estado de la transacción
  status VARCHAR(50) NOT NULL,
  status_message TEXT,
  
  -- Información del pago
  amount_in_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  payment_method_type VARCHAR(50),
  payment_source_id VARCHAR(255),
  
  -- Información del cliente
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  
  -- Webhook data
  signature_checksum VARCHAR(255),
  raw_webhook_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finalized_at TIMESTAMP WITH TIME ZONE,
  webhook_received_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de compras de cursos (relación usuario-curso)
CREATE TABLE IF NOT EXISTS course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Estado de la compra
  is_active BOOLEAN DEFAULT true,
  access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadatos
  purchase_price DECIMAL(10,2),
  discount_applied DECIMAL(10,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: un usuario no puede comprar el mismo curso dos veces
  UNIQUE(user_id, course_id)
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_course_id ON orders(course_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_wompi_transaction_id ON orders(wompi_transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Índices para wompi_transactions
CREATE INDEX IF NOT EXISTS idx_wompi_transactions_order_id ON wompi_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_wompi_transactions_wompi_id ON wompi_transactions(wompi_transaction_id);
CREATE INDEX IF NOT EXISTS idx_wompi_transactions_status ON wompi_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wompi_transactions_created_at ON wompi_transactions(created_at);

-- Índices para course_purchases
CREATE INDEX IF NOT EXISTS idx_course_purchases_user_id ON course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_course_id ON course_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_order_id ON course_purchases(order_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_is_active ON course_purchases(is_active);

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_purchases_updated_at 
    BEFORE UPDATE ON course_purchases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS (ROW LEVEL SECURITY)
-- =============================================

-- Habilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wompi_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;

-- Políticas para orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para wompi_transactions (solo lectura para usuarios)
CREATE POLICY "Users can view transactions for their orders" ON wompi_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = wompi_transactions.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Políticas para course_purchases
CREATE POLICY "Users can view their own purchases" ON course_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" ON course_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista para órdenes con información del curso
CREATE OR REPLACE VIEW orders_with_course_info AS
SELECT 
    o.*,
    c.title as course_title,
    c.preview_image as course_image,
    c.instructor as course_instructor
FROM orders o
LEFT JOIN courses c ON o.course_id = c.id;

-- Vista para compras activas del usuario
CREATE OR REPLACE VIEW user_active_purchases AS
SELECT 
    cp.*,
    c.title as course_title,
    c.preview_image as course_image,
    c.instructor as course_instructor,
    c.duration_days,
    c.lessons_count
FROM course_purchases cp
JOIN courses c ON cp.course_id = c.id
WHERE cp.is_active = true;

-- =============================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =============================================

-- Insertar algunos métodos de pago de prueba para Wompi sandbox
-- Estos son los métodos disponibles en el ambiente de pruebas

/*
MÉTODOS DE PAGO DISPONIBLES EN WOMPI SANDBOX:

1. Tarjeta de crédito:
   - Número: 4242424242424242
   - CVV: 123
   - Fecha: Cualquier fecha futura
   - Nombre: Cualquier nombre

2. PSE:
   - Usar cualquier banco de la lista
   - Cualquier número de cuenta

3. Nequi:
   - Número: 3001234567
   - Cualquier código de confirmación

4. Bancolombia:
   - Usar datos de prueba proporcionados por Wompi
*/

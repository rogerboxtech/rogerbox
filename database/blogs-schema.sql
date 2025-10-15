-- Tabla para blogs nutricionales
CREATE TABLE IF NOT EXISTS nutritional_blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    author VARCHAR(100) NOT NULL,
    reading_time INTEGER NOT NULL, -- en minutos
    excerpt TEXT NOT NULL, -- texto corto de resumen
    content TEXT NOT NULL, -- contenido completo del blog
    featured_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_nutritional_blogs_published ON nutritional_blogs(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_nutritional_blogs_slug ON nutritional_blogs(slug);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_nutritional_blogs_updated_at 
    BEFORE UPDATE ON nutritional_blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos blogs de ejemplo
INSERT INTO nutritional_blogs (title, slug, author, reading_time, excerpt, content, featured_image_url, is_published, published_at) VALUES
(
    '5 Tips para Mantenerte Hidratado Durante el Ejercicio',
    'tips-hidratacion-ejercicio',
    'Dr. María González',
    3,
    'La hidratación es clave para un rendimiento óptimo. Descubre cómo mantenerte hidratado antes, durante y después del ejercicio.',
    'La hidratación adecuada es fundamental para el rendimiento deportivo y la salud general. Aquí te comparto 5 consejos prácticos:

1. **Bebe agua antes del ejercicio**: Consume 500ml de agua 2-3 horas antes de entrenar.

2. **Hidrátate durante el ejercicio**: Bebe 150-250ml cada 15-20 minutos durante el entrenamiento.

3. **Reemplaza electrolitos**: En sesiones largas (más de 1 hora), considera bebidas deportivas.

4. **Monitorea tu orina**: El color debe ser amarillo claro, no oscuro.

5. **No esperes a tener sed**: La sed es un indicador tardío de deshidratación.

Recuerda que cada persona tiene necesidades diferentes. Escucha a tu cuerpo y ajusta según tu nivel de actividad.',
    '/images/blogs/hidratacion-ejercicio.jpg',
    true,
    NOW()
),
(
    'Proteínas: Tu Aliado para la Recuperación Muscular',
    'proteinas-recuperacion-muscular',
    'Nutricionista Carlos Ruiz',
    4,
    'Las proteínas son esenciales para la recuperación y crecimiento muscular. Aprende cuándo y cómo consumirlas.',
    'Las proteínas son los bloques de construcción de tus músculos. Después del ejercicio, tus músculos necesitan reparación y las proteínas son fundamentales para este proceso.

**¿Cuánta proteína necesitas?**
- Personas activas: 1.2-1.7g por kg de peso corporal
- Atletas de fuerza: 1.6-2.2g por kg de peso corporal

**Mejores fuentes de proteína:**
- Pollo, pescado, huevos
- Legumbres y quinoa
- Lácteos bajos en grasa
- Frutos secos y semillas

**Timing de consumo:**
- Ventana anabólica: 30-60 minutos post-entrenamiento
- Distribuye la proteína a lo largo del día
- Incluye proteína en cada comida

**Señales de deficiencia:**
- Recuperación lenta
- Pérdida de masa muscular
- Fatiga constante

Incluye proteínas de calidad en cada comida para optimizar tu recuperación y rendimiento.',
    '/images/blogs/proteinas-musculo.jpg',
    true,
    NOW()
),
(
    'Carbohidratos: Energía para tu Entrenamiento',
    'carbohidratos-energia-entrenamiento',
    'Dra. Ana Martínez',
    3,
    'Los carbohidratos son tu principal fuente de energía. Descubre cómo usarlos estratégicamente.',
    'Los carbohidratos son la gasolina de tu cuerpo. Proporcionan energía rápida y son esenciales para el rendimiento deportivo.

**Tipos de carbohidratos:**
- **Simples**: Frutas, miel, azúcar (energía rápida)
- **Complejos**: Avena, arroz integral, quinoa (energía sostenida)

**Timing estratégico:**
- **Antes del ejercicio**: Carbohidratos complejos 2-3 horas antes
- **Durante**: Carbohidratos simples si el ejercicio es prolongado
- **Después**: Combinación de simples y complejos para recuperación

**Cantidades recomendadas:**
- Ejercicio moderado: 3-5g por kg de peso
- Ejercicio intenso: 6-10g por kg de peso

**Señales de deficiencia:**
- Fatiga temprana
- Mareos durante el ejercicio
- Dificultad para concentrarse

Planifica tu consumo de carbohidratos según tu tipo de entrenamiento para maximizar tu energía y rendimiento.',
    '/images/blogs/carbohidratos-energia.jpg',
    true,
    NOW()
);

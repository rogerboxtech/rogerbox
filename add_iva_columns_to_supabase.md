# Script para agregar columnas de IVA a Supabase

## Ejecutar en el SQL Editor de Supabase:

```sql
-- Agregar columnas de IVA a la tabla courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS include_iva BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS iva_percentage INTEGER DEFAULT 19;

-- Verificar que se crearon las columnas
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
AND column_name IN ('include_iva', 'iva_percentage');
```

## Pasos:

1. Ir a Supabase Dashboard
2. Seleccionar el proyecto rogerboxtech
3. Ir a SQL Editor
4. Ejecutar el script anterior
5. Verificar que las columnas se crearon correctamente

## Resultado esperado:

Las columnas `include_iva` e `iva_percentage` deberían aparecer en la tabla `courses` con:
- `include_iva`: BOOLEAN, DEFAULT FALSE
- `iva_percentage`: INTEGER, DEFAULT 19

## Después de ejecutar:

1. Los cursos existentes tendrán `include_iva = false` e `iva_percentage = 19` por defecto
2. El admin panel podrá guardar y editar estos campos
3. El dashboard mostrará los precios correctos con IVA y descuentos


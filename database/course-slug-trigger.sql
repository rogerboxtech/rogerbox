-- =============================================
-- TRIGGER PARA GENERAR SLUGS AUTOMÁTICAMENTE
-- =============================================

-- Función para generar slug a partir del título
CREATE OR REPLACE FUNCTION generate_course_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convertir a minúsculas y limpiar
    slug := LOWER(TRIM(title));
    
    -- Reemplazar caracteres especiales y acentos
    slug := REPLACE(slug, 'á', 'a');
    slug := REPLACE(slug, 'à', 'a');
    slug := REPLACE(slug, 'ä', 'a');
    slug := REPLACE(slug, 'â', 'a');
    slug := REPLACE(slug, 'ã', 'a');
    slug := REPLACE(slug, 'é', 'e');
    slug := REPLACE(slug, 'è', 'e');
    slug := REPLACE(slug, 'ë', 'e');
    slug := REPLACE(slug, 'ê', 'e');
    slug := REPLACE(slug, 'í', 'i');
    slug := REPLACE(slug, 'ì', 'i');
    slug := REPLACE(slug, 'ï', 'i');
    slug := REPLACE(slug, 'î', 'i');
    slug := REPLACE(slug, 'ó', 'o');
    slug := REPLACE(slug, 'ò', 'o');
    slug := REPLACE(slug, 'ö', 'o');
    slug := REPLACE(slug, 'ô', 'o');
    slug := REPLACE(slug, 'õ', 'o');
    slug := REPLACE(slug, 'ú', 'u');
    slug := REPLACE(slug, 'ù', 'u');
    slug := REPLACE(slug, 'ü', 'u');
    slug := REPLACE(slug, 'û', 'u');
    slug := REPLACE(slug, 'ñ', 'n');
    slug := REPLACE(slug, 'ç', 'c');
    
    -- Remover caracteres especiales excepto espacios y guiones
    slug := REGEXP_REPLACE(slug, '[^a-z0-9\s-]', '', 'g');
    
    -- Reemplazar espacios múltiples con un solo guión
    slug := REGEXP_REPLACE(slug, '\s+', '-', 'g');
    
    -- Reemplazar guiones múltiples con un solo guión
    slug := REGEXP_REPLACE(slug, '-+', '-', 'g');
    
    -- Remover guiones al inicio y final
    slug := TRIM(slug, '-');
    
    -- Si está vacío, usar slug por defecto
    IF slug = '' THEN
        slug := 'curso-sin-titulo';
    END IF;
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Función para generar slug único
CREATE OR REPLACE FUNCTION generate_unique_course_slug(title TEXT, course_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    slug TEXT;
    counter INTEGER := 1;
    exists_count INTEGER;
BEGIN
    -- Generar slug base
    base_slug := generate_course_slug(title);
    slug := base_slug;
    
    -- Verificar si el slug ya existe
    LOOP
        IF course_id IS NULL THEN
            -- Para nuevos cursos
            SELECT COUNT(*) INTO exists_count 
            FROM courses 
            WHERE slug = slug;
        ELSE
            -- Para cursos existentes (excluir el curso actual)
            SELECT COUNT(*) INTO exists_count 
            FROM courses 
            WHERE slug = slug AND id != course_id;
        END IF;
        
        -- Si no existe, usar este slug
        IF exists_count = 0 THEN
            EXIT;
        END IF;
        
        -- Si existe, agregar contador
        slug := base_slug || '-' || counter;
        counter := counter + 1;
        
        -- Prevenir bucle infinito
        IF counter > 1000 THEN
            slug := base_slug || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar slug automáticamente al insertar
CREATE OR REPLACE FUNCTION trigger_generate_course_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo generar slug si no se proporciona uno
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_unique_course_slug(NEW.title, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS generate_course_slug_trigger ON courses;
CREATE TRIGGER generate_course_slug_trigger
    BEFORE INSERT OR UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_course_slug();

-- =============================================
-- ACTUALIZAR CURSOS EXISTENTES
-- =============================================

-- Actualizar cursos existentes que no tienen slug
UPDATE courses 
SET slug = generate_unique_course_slug(title, id)
WHERE slug IS NULL OR slug = '';

-- =============================================
-- EJEMPLOS DE USO
-- =============================================

/*
-- Insertar un nuevo curso (el slug se generará automáticamente)
INSERT INTO courses (title, price, is_published) 
VALUES ('🔥 HIIT Cardio 40 Minutos', 45000, true);

-- El slug generado será: 'hiit-cardio-40-minutos'

-- Insertar otro curso con título similar
INSERT INTO courses (title, price, is_published) 
VALUES ('🔥 HIIT Cardio 40 Minutos', 50000, true);

-- El slug generado será: 'hiit-cardio-40-minutos-1'

-- Actualizar título de un curso existente
UPDATE courses 
SET title = 'Nuevo Título del Curso'
WHERE id = 'some-uuid';

-- El slug se actualizará automáticamente si no se especifica uno
*/

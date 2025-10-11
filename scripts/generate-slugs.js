const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function generateSlugs() {
  console.log('🔄 Generando slugs para cursos existentes...\n');

  try {
    // Obtener todos los cursos sin slug
    const { data: courses, error: fetchError } = await supabase
      .from('courses')
      .select('id, title, slug')
      .is('slug', null);

    if (fetchError) {
      console.error('❌ Error fetching courses:', fetchError);
      return;
    }

    if (!courses || courses.length === 0) {
      console.log('✅ Todos los cursos ya tienen slugs');
      return;
    }

    console.log(`📊 Encontrados ${courses.length} cursos sin slug`);

    // Generar slugs únicos
    for (const course of courses) {
      let baseSlug = generateSlug(course.title);
      let finalSlug = baseSlug;
      let counter = 0;

      // Verificar que el slug sea único
      while (true) {
        const { data: existing } = await supabase
          .from('courses')
          .select('id')
          .eq('slug', finalSlug)
          .neq('id', course.id)
          .single();

        if (!existing) break;

        counter++;
        finalSlug = `${baseSlug}-${counter}`;
      }

      // Actualizar el curso con el slug
      const { error: updateError } = await supabase
        .from('courses')
        .update({ slug: finalSlug })
        .eq('id', course.id);

      if (updateError) {
        console.error(`❌ Error updating course ${course.id}:`, updateError);
      } else {
        console.log(`✅ ${course.title} → ${finalSlug}`);
      }
    }

    console.log('\n🎉 ¡Slugs generados exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

generateSlugs();

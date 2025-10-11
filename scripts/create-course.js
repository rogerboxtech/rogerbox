#!/usr/bin/env node

/**
 * 🎬 Script para crear el curso de HIIT en la base de datos
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (reemplaza con tus credenciales)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCourse() {
  try {
    console.log('🎬 Creando curso de HIIT...');

    // Crear el curso
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert([
        {
          id: 'quema-grasa-full-body-con-pesas-hiit',
          title: 'Quema Grasa Full Body con Pesas HIIT',
          description: 'Rutina completa de HIIT con pesas para quemar grasa y tonificar todo el cuerpo. Ejercicios intensos de 40 minutos que te ayudarán a transformar tu físico rápidamente.',
          short_description: 'Rutina HIIT de 40 minutos con pesas para quemar grasa y tonificar',
          price: 29.99,
          thumbnail: '/images/courses/course-1.jpg',
          preview_image: '/images/courses/course-1.jpg',
          duration_minutes: 40,
          difficulty_level: 'intermediate',
          rating: 4.8,
          total_ratings: 156,
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (courseError) {
      console.error('❌ Error creando curso:', courseError);
      return;
    }

    console.log('✅ Curso creado:', course.id);

    // Crear lecciones
    const lessons = [
      {
        id: 'leccion-1-fundamentos',
        course_id: course.id,
        title: 'Entrenamiento Full Body #1—Fundamentos con Pesas',
        description: 'Aprende los fundamentos del entrenamiento con pesas y prepárate para la rutina HIIT',
        duration_minutes: 30,
        order_index: 1,
        is_preview: true,
        video_url: 'https://player.mux.com/FpRl00g92eSuAZ6qJpveuWuI9iev2LIJAisdN79iAjkE',
        created_at: new Date().toISOString()
      },
      {
        id: 'leccion-2-hiit-pesas',
        course_id: course.id,
        title: 'HIIT con Pesas: Quema Máxima de Calorías',
        description: 'Rutina intensa de HIIT con pesas para maximizar la quema de calorías',
        duration_minutes: 25,
        order_index: 2,
        is_preview: false,
        video_url: 'https://player.mux.com/FpRl00g92eSuAZ6qJpveuWuI9iev2LIJAisdN79iAjkE',
        created_at: new Date().toISOString()
      }
    ];

    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .insert(lessons)
      .select();

    if (lessonsError) {
      console.error('❌ Error creando lecciones:', lessonsError);
      return;
    }

    console.log('✅ Lecciones creadas:', lessonsData.length);

    // Crear categoría si no existe
    const { data: category, error: categoryError } = await supabase
      .from('course_categories')
      .upsert([
        {
          id: 'fitness-hiit',
          name: 'Fitness HIIT',
          description: 'Entrenamientos de alta intensidad con pesas',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (categoryError) {
      console.error('❌ Error creando categoría:', categoryError);
    } else {
      console.log('✅ Categoría creada:', category.name);
    }

    // Asociar curso con categoría
    const { error: courseCategoryError } = await supabase
      .from('course_categories')
      .update({ course_ids: [course.id] })
      .eq('id', 'fitness-hiit');

    if (courseCategoryError) {
      console.error('❌ Error asociando curso con categoría:', courseCategoryError);
    } else {
      console.log('✅ Curso asociado con categoría');
    }

    console.log('\n🎉 ¡Curso creado exitosamente!');
    console.log(`📺 URL: http://localhost:3000/course/${course.id}`);
    console.log(`🎬 Título: ${course.title}`);
    console.log(`💰 Precio: $${course.price}`);
    console.log(`📚 Lecciones: ${lessonsData.length}`);

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createCourse();

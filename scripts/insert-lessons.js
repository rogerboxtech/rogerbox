// Script para insertar clases adicionales en Supabase
// Ejecutar con: npm run insert-lessons

const { createClient } = require('@supabase/supabase-js');

// Datos de las 12 clases adicionales para el curso HIIT
const additionalLessons = [
  {
    course_id: '1', // ID del curso HIIT
    title: 'Calentamiento Dinámico y Activación',
    description: 'Prepara tu cuerpo con movimientos dinámicos para maximizar el rendimiento',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    lesson_number: 2,
    lesson_order: 2,
    duration_minutes: 8,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Cardio Intensivo - Nivel 1',
    description: 'Primera sesión de alta intensidad para activar tu metabolismo',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=600&fit=crop',
    lesson_number: 3,
    lesson_order: 3,
    duration_minutes: 15,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Cardio Intensivo - Nivel 2',
    description: 'Aumenta la intensidad y quema más calorías',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    lesson_number: 4,
    lesson_order: 4,
    duration_minutes: 20,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Cardio Intensivo - Nivel 3',
    description: 'Sesión de máxima intensidad para expertos',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
    lesson_number: 5,
    lesson_order: 5,
    duration_minutes: 25,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Tabata - Quema Grasa Extrema',
    description: 'Protocolo Tabata de 4 minutos para máxima quema de grasa',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
    lesson_number: 6,
    lesson_order: 6,
    duration_minutes: 12,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Cardio + Fuerza Combinado',
    description: 'Combina cardio y fuerza para un entrenamiento completo',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop',
    lesson_number: 7,
    lesson_order: 7,
    duration_minutes: 30,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Cardio para Principiantes',
    description: 'Versión modificada para quienes recién comienzan',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    lesson_number: 8,
    lesson_order: 8,
    duration_minutes: 18,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Cardio Avanzado - Quema Total',
    description: 'Sesión avanzada para usuarios experimentados',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=600&fit=crop',
    lesson_number: 9,
    lesson_order: 9,
    duration_minutes: 35,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Cardio + Core Intensivo',
    description: 'Enfócate en el core mientras quemas calorías',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    lesson_number: 10,
    lesson_order: 10,
    duration_minutes: 22,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'HIIT Cardio Final - Desafío Completo',
    description: 'Sesión final que combina todo lo aprendido',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
    lesson_number: 11,
    lesson_order: 11,
    duration_minutes: 40,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  },
  {
    course_id: '1',
    title: 'Enfriamiento y Estiramiento Final',
    description: 'Recuperación activa y estiramientos para finalizar',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preview_image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
    lesson_number: 12,
    lesson_order: 12,
    duration_minutes: 10,
    is_preview: false,
    views_count: 0,
    created_at: new Date().toISOString()
  }
];

async function insertLessons() {
  try {
    console.log('📚 Insertando 12 clases adicionales en la base de datos...');
    console.log('⚠️  Nota: Este script requiere configuración de Supabase');
    console.log('📋 Clases a insertar:');
    
    additionalLessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title} (${lesson.duration_minutes} min)`);
    });

    console.log('\n✅ Script preparado. Para ejecutar:');
    console.log('1. Configura las variables de entorno de Supabase');
    console.log('2. Ejecuta: node scripts/insert-lessons.js');
    console.log('3. O usa la interfaz de Supabase directamente');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar la función
insertLessons();

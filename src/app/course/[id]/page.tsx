'use client';

import { useParams } from 'next/navigation';
import CourseLessons from '@/components/CourseLessons';

// Mock data - En una app real esto vendría de una API
const mockCourses = {
  '1': {
    id: '1',
    title: 'HIIT para Principiantes - Bajar de Peso',
    instructor: 'Roger Barreto',
    description: 'Rutina HIIT diseñada específicamente para quemar grasa y bajar de peso de forma efectiva. Perfecto para principiantes que quieren empezar su transformación.',
    thumbnail: '/api/placeholder/300/200',
    rating: 4.9,
    students: 1250,
    duration: '4 semanas',
    level: 'Principiante',
    lessons: [
      {
        id: '1-1',
        title: 'Introducción al HIIT',
        description: 'Conoce los fundamentos del entrenamiento HIIT y prepárate para tu transformación.',
        duration: '15 min',
        isCompleted: true,
        isLocked: false,
        videoUrl: '/videos/lesson-1.mp4',
        difficulty: 'Fácil',
        caloriesBurned: 120,
        weightLoss: 15,
        exercises: [
          {
            id: '1-1-1',
            name: 'Calentamiento dinámico',
            duration: '5 min',
            reps: '1 serie',
            rest: '30 seg',
            description: 'Movimientos suaves para preparar el cuerpo'
          },
          {
            id: '1-1-2',
            name: 'Introducción teórica',
            duration: '5 min',
            reps: '1 serie',
            rest: '0 seg',
            description: 'Explicación de la metodología HIIT'
          },
          {
            id: '1-1-3',
            name: 'Estiramiento inicial',
            duration: '5 min',
            reps: '1 serie',
            rest: '30 seg',
            description: 'Flexibilidad y preparación muscular'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Primera sesión HIIT',
        description: 'Tu primera experiencia real con el entrenamiento HIIT. Intensidad moderada.',
        duration: '25 min',
        isCompleted: true,
        isLocked: false,
        videoUrl: '/videos/lesson-2.mp4',
        difficulty: 'Fácil',
        caloriesBurned: 180,
        weightLoss: 25,
        exercises: [
          {
            id: '1-2-1',
            name: 'Burpees modificados',
            duration: '4 min',
            reps: '8 rondas x 30 seg',
            rest: '30 seg',
            description: 'Burpees adaptados para principiantes'
          },
          {
            id: '1-2-2',
            name: 'Jumping jacks',
            duration: '4 min',
            reps: '8 rondas x 30 seg',
            rest: '30 seg',
            description: 'Salto de tijera para activar el cardio'
          },
          {
            id: '1-2-3',
            name: 'Mountain climbers',
            duration: '4 min',
            reps: '8 rondas x 30 seg',
            rest: '30 seg',
            description: 'Escaladores de montaña en el suelo'
          },
          {
            id: '1-2-4',
            name: 'High knees',
            duration: '4 min',
            reps: '8 rondas x 30 seg',
            rest: '30 seg',
            description: 'Rodillas altas en el lugar'
          },
          {
            id: '1-2-5',
            name: 'Enfriamiento',
            duration: '5 min',
            reps: '1 serie',
            rest: '0 seg',
            description: 'Relajación y estiramiento final'
          }
        ]
      },
      {
        id: '1-3',
        title: 'Intensidad Media',
        description: 'Aumenta la intensidad y quema más calorías con esta sesión intermedia.',
        duration: '30 min',
        isCompleted: false,
        isLocked: false,
        videoUrl: '/videos/lesson-3.mp4',
        difficulty: 'Medio',
        caloriesBurned: 250,
        weightLoss: 35,
        exercises: [
          {
            id: '1-3-1',
            name: 'Burpees completos',
            duration: '5 min',
            reps: '10 rondas x 30 seg',
            rest: '30 seg',
            description: 'Burpees completos con salto'
          },
          {
            id: '1-3-2',
            name: 'Jump squats',
            duration: '5 min',
            reps: '10 rondas x 30 seg',
            rest: '30 seg',
            description: 'Sentadillas con salto'
          },
          {
            id: '1-3-3',
            name: 'Push-ups explosivos',
            duration: '5 min',
            reps: '10 rondas x 30 seg',
            rest: '30 seg',
            description: 'Flexiones con impulso'
          },
          {
            id: '1-3-4',
            name: 'Plank jacks',
            duration: '5 min',
            reps: '10 rondas x 30 seg',
            rest: '30 seg',
            description: 'Plancha con salto de piernas'
          },
          {
            id: '1-3-5',
            name: 'Enfriamiento',
            duration: '5 min',
            reps: '1 serie',
            rest: '0 seg',
            description: 'Relajación y estiramiento final'
          }
        ]
      },
      {
        id: '1-4',
        title: 'Sesión Avanzada',
        description: 'Desafía tus límites con esta sesión de alta intensidad.',
        duration: '35 min',
        isCompleted: false,
        isLocked: true,
        videoUrl: '/videos/lesson-4.mp4',
        difficulty: 'Difícil',
        caloriesBurned: 320,
        weightLoss: 45,
        exercises: [
          {
            id: '1-4-1',
            name: 'Burpees con salto',
            duration: '6 min',
            reps: '12 rondas x 30 seg',
            rest: '30 seg',
            description: 'Burpees con salto explosivo'
          },
          {
            id: '1-4-2',
            name: 'Pistol squats',
            duration: '6 min',
            reps: '12 rondas x 30 seg',
            rest: '30 seg',
            description: 'Sentadillas a una pierna'
          },
          {
            id: '1-4-3',
            name: 'Handstand push-ups',
            duration: '6 min',
            reps: '12 rondas x 30 seg',
            rest: '30 seg',
            description: 'Flexiones en parada de manos'
          },
          {
            id: '1-4-4',
            name: 'Box jumps',
            duration: '6 min',
            reps: '12 rondas x 30 seg',
            rest: '30 seg',
            description: 'Saltos al cajón'
          },
          {
            id: '1-4-5',
            name: 'Enfriamiento',
            duration: '5 min',
            reps: '1 serie',
            rest: '0 seg',
            description: 'Relajación y estiramiento final'
          }
        ]
      }
    ]
  }
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  
  const course = mockCourses[courseId as keyof typeof mockCourses];
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
          <p>El curso que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <CourseLessons
      courseId={course.id}
      courseTitle={course.title}
      courseInstructor={course.instructor}
      courseDescription={course.description}
      courseThumbnail={course.thumbnail}
      courseRating={course.rating}
      courseStudents={course.students}
      courseDuration={course.duration}
      courseLevel={course.level}
      lessons={course.lessons}
    />
  );
}

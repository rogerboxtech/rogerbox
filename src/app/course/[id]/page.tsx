'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Users, 
  Star, 
  Flame, 
  BookOpen,
  Share2,
  Heart,
  ShoppingCart,
  Lock,
} from 'lucide-react';
import RogerAlert from '@/components/RogerAlert';
import { supabase } from '@/lib/supabase';
import QuickLoading from '@/components/QuickLoading';

interface Course {
  id: string;
  title: string;
  short_description: string;
  description: string;
  preview_image: string | null;
  price: number;
  discount_percentage: number;
  category: string;
  duration_days: number;
  students_count: number;
  rating: number;
  calories_burned: number;
  level: string;
  is_published: boolean;
  created_at: string;
  intro_video_url: string;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  preview_image: string | null;
  lesson_number: number;
  lesson_order: number;
  duration_minutes: number;
  is_preview: boolean;
  views_count: number;
  created_at: string;
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [userRating, setUserRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [rogerAlert, setRogerAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (resolvedParams.id) {
      loadCourseData();
    }
  }, [resolvedParams.id, status, router]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Datos de ejemplo para los cursos
      const sampleCourses: Course[] = [
        {
          id: '1',
          title: 'Transformación Total 90 Días',
          short_description: 'Programa completo de transformación física en 90 días con desbloqueo diario de clases.',
          description: 'Este curso te llevará a través de una transformación completa de tu cuerpo y mente en 90 días. Con rutinas diarias progresivas, plan nutricional personalizado y seguimiento constante, lograrás los resultados que siempre has deseado.',
          preview_image: '/images/curso-transformacion.jpg',
          price: 89000,
          discount_percentage: 40,
          category: 'Pérdida de Peso',
          duration_days: 90,
          students_count: 2847,
          rating: 4.9,
          calories_burned: 500,
          level: 'Intermedio',
          is_published: true,
          created_at: new Date().toISOString(),
          intro_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: '2',
          title: 'HIIT Quema Grasa',
          short_description: 'Entrenamiento de alta intensidad para quemar grasa y tonificar músculos.',
          description: 'Rutinas HIIT diseñadas para maximizar la quema de grasa en el menor tiempo posible. Perfecto para personas con poco tiempo pero que quieren resultados efectivos.',
          preview_image: '/images/curso-hiit.jpg',
          price: 69000,
          discount_percentage: 30,
          category: 'HIIT',
          duration_days: 21,
          students_count: 1456,
          rating: 4.7,
          calories_burned: 400,
          level: 'Avanzado',
          is_published: true,
          created_at: new Date().toISOString(),
          intro_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        {
          id: '3',
          title: 'Fuerza y Músculo',
          short_description: 'Desarrolla fuerza muscular con ejercicios progresivos y técnicas avanzadas.',
          description: 'Programa completo para desarrollar fuerza y masa muscular de forma segura y efectiva. Incluye técnicas avanzadas y progresión personalizada.',
          preview_image: '/images/curso-fuerza.jpg',
          price: 79000,
          discount_percentage: 0,
          category: 'Fuerza',
          duration_days: 60,
          students_count: 1923,
          rating: 4.8,
          calories_burned: 350,
          level: 'Intermedio',
          is_published: true,
          created_at: new Date().toISOString(),
          intro_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ];

      // Buscar el curso en los datos de ejemplo
      const courseData = sampleCourses.find(c => c.id === resolvedParams.id);
      
      if (!courseData) {
        setError('Curso no encontrado');
        return;
      }

      setCourse(courseData);

      // Lecciones de ejemplo
      const sampleLessons: Lesson[] = [
        {
          id: '1',
          course_id: resolvedParams.id,
          title: 'Introducción y Calentamiento',
          description: 'Conoce los fundamentos y prepárate para el entrenamiento',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          preview_image: '/images/leccion-1.jpg',
          lesson_number: 1,
          lesson_order: 1,
          duration_minutes: 15,
          is_preview: true,
          views_count: 0,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          course_id: resolvedParams.id,
          title: 'Rutina Principal',
          description: 'Ejercicios principales del día',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          preview_image: '/images/leccion-2.jpg',
          lesson_number: 2,
          lesson_order: 2,
          duration_minutes: 30,
          is_preview: false,
          views_count: 0,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          course_id: resolvedParams.id,
          title: 'Enfriamiento y Estiramiento',
          description: 'Relajación y estiramiento final',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          preview_image: '/images/leccion-3.jpg',
          lesson_number: 3,
          lesson_order: 3,
          duration_minutes: 10,
          is_preview: false,
          views_count: 0,
          created_at: new Date().toISOString()
        }
      ];

      setLessons(sampleLessons);

      // Verificar si el usuario ya calificó este curso
      await checkUserRating();

    } catch (error) {
      console.error('Error loading course data:', error);
      setError('Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRating = async () => {
    if (!(session as any)?.user?.id) return;
    
    try {
      // Por ahora, simulamos que el usuario no ha calificado
      // En el futuro, aquí consultaríamos la tabla course_ratings
      setHasUserRated(false);
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  const handleEnroll = async () => {
    if (!(session as any)?.user?.id) {
      router.push('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!course || !session?.user?.email) return;
    
    setPaymentStatus('processing');
    
    try {
      // Calcular precio final con descuento
      const discountAmount = course.discount_percentage > 0 
        ? (course.price * course.discount_percentage) / 100 
        : 0;
      const finalPrice = course.price - discountAmount;
      
      // Crear orden en Wompi
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          amount: finalPrice,
          originalPrice: course.price,
          discountAmount: discountAmount,
          customerEmail: session.user.email,
          customerName: session.user.name || ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden');
      }

      // Redirigir a Wompi para completar el pago
      if (data.wompi?.redirect_url) {
        window.location.href = data.wompi.redirect_url;
      } else {
        throw new Error('No se recibió URL de redirección');
      }
      
    } catch (error) {
      setPaymentStatus('error');
      console.error('Error en el pago:', error);
      
      // Mostrar alerta de error
      setRogerAlert({
        isOpen: true,
        title: 'Error en el Pago',
        message: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.',
        type: 'error'
      });
    }
  };

  const handleStartDateSelect = (date: Date) => {
    setSelectedStartDate(date);
  };

  const confirmStartDate = () => {
    if (selectedStartDate) {
      // Aquí se guardaría la fecha de inicio en la base de datos
      console.log('Fecha de inicio seleccionada:', selectedStartDate);
      setIsEnrolled(true);
      setShowCalendarModal(false);
      
      // Mostrar mensaje de éxito
      setRogerAlert({
        isOpen: true,
        title: '¡Curso Inscrito!',
        message: `¡Perfecto! Tu curso comenzará el ${selectedStartDate.toLocaleDateString('es-CO')} y tendrás ${course?.duration_days} días para completarlo.`,
        type: 'success'
      });
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  const submitRating = async () => {
    if (userRating > 0 && course) {
      try {
        // Calcular nuevo promedio (simplificado por ahora)
        const currentRating = course.rating || 0;
        const currentStudents = course.students_count || 0;
        
        // Fórmula simple: (rating_actual * estudiantes + nueva_calificación) / (estudiantes + 1)
        const newAverage = ((currentRating * currentStudents) + userRating) / (currentStudents + 1);
        const roundedAverage = Math.round(newAverage * 10) / 10; // Redondear a 1 decimal

        // Actualizar el curso con el nuevo rating y contador de estudiantes
        const { error: updateError } = await supabase
          .from('courses')
          .update({ 
            rating: roundedAverage,
            students_count: currentStudents + 1
          })
          .eq('id', course.id);

        if (updateError) {
          console.error('Error updating course rating:', updateError);
          throw updateError;
        }

        // Actualizar el estado local
        setCourse(prev => prev ? {
          ...prev,
          rating: roundedAverage,
          students_count: currentStudents + 1
        } : null);

        // Marcar que el usuario ya calificó
        setHasUserRated(true);
        setUserRating(userRating); // Guardar la calificación del usuario

        setShowRatingModal(false);
        
        // Mostrar mensaje de éxito
        setRogerAlert({
          isOpen: true,
          title: '¡Calificación Enviada!',
          message: `¡Gracias por calificar el curso con ${userRating} estrellas! El promedio del curso ahora es ${roundedAverage} estrellas.`,
          type: 'success'
        });

      } catch (error) {
        console.error('Error submitting rating:', error);
        setRogerAlert({
          isOpen: true,
          title: 'Error',
          message: 'Hubo un problema al enviar tu calificación. Por favor, inténtalo de nuevo.',
          type: 'error'
        });
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareCourse = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Mostrar feedback visual
      const button = document.getElementById('copy-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '¡Copiado!';
        button.className = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors';
        setTimeout(() => {
          button.textContent = originalText;
          button.className = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors';
        }, 2000);
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (status === 'loading' || loading) {
    return <QuickLoading message="Cargando curso..." duration={1000} />;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Curso no encontrado'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            El curso que buscas no existe o no está disponible
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Botón de regreso flotante */}
            <button
              onClick={() => router.back()}
              className="fixed top-4 left-4 z-10 flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Volver</span>
            </button>

            {/* Video principal */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative group">
                {course.preview_image ? (
                  <div className="relative w-full h-full">
                    <img
                      src={course.preview_image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all duration-300">
                      <button className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-6 transition-all duration-300 transform hover:scale-110 shadow-2xl">
                        <Play className="w-16 h-16 text-[#85ea10]" />
                      </button>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {course.duration_days} días
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-12 h-12 text-gray-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Imagen del curso no disponible</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información del curso */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              {/* Header del curso */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
                    {course.title}
                  </h1>
                  
                  {/* Botones de acción */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 rounded-lg transition-colors ${
                        isFavorite 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={shareCourse}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-3">
                  {course.short_description}
                </p>
              </div>

              {/* Estadísticas del curso */}
              <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(course.rating)
                            ? 'text-yellow-400 fill-current'
                            : star <= course.rating
                            ? 'text-yellow-400 fill-current opacity-50'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-sm">{course.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">calificación</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{(course.students_count + (isEnrolled ? 1 : 0)).toLocaleString()} estudiantes</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{course.duration_days} días</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">{course.calories_burned} cal</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">{lessons.length} lecciones</span>
                </div>
              </div>

              {/* Precio y botón de inscripción */}
              {!isEnrolled ? (
                <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-[#85ea10]/10 to-[#85ea10]/5 rounded-lg border border-[#85ea10]/20">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${course.price.toLocaleString('es-CO')} COP
                      </div>
                      {course.discount_percentage > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ${Math.round(course.price / (1 - course.discount_percentage / 100)).toLocaleString('es-CO')} COP
                        </div>
                      )}
                    </div>
                    {course.discount_percentage > 0 && (
                      <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-sm font-medium">
                        {course.discount_percentage}% de descuento
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={handleEnroll}
                      className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Inscribirse al curso</span>
                    </button>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Garantía de devolución de 30 días
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                      ¡Comienza tus clases!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      Recuerda buscar un lugar cómodo con espacio, fresco y conecta tus audífonos!
                    </p>
                    <div className="flex justify-center space-x-3">
                      {!hasUserRated && (
                        <button
                          onClick={() => setShowRatingModal(true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Star className="w-4 h-4" />
                          <span>Calificar curso</span>
                        </button>
                      )}
                      {hasUserRated && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">¡Ya calificaste este curso!</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          if (lessons.length > 0) {
                            router.push(`/lesson/${lessons[0].id}`);
                          }
                        }}
                        className="bg-[#85ea10] hover:bg-[#7dd30f] text-black px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Comenzar lección</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Acerca de este curso
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lecciones del curso */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Lecciones del curso ({lessons.length})
              </h4>
              
              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No hay lecciones disponibles aún
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
            isEnrolled || lesson.is_preview
              ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer hover:shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
          }`}
          onClick={() => {
            if (isEnrolled || lesson.is_preview) {
              router.push(`/lesson/${lesson.id}`);
            }
          }}
        >
                      <div className="flex">
                        {/* Imagen de la lección */}
                        <div className="relative w-16 h-12 flex-shrink-0">
                          {lesson.preview_image ? (
                            <div className="relative w-full h-full">
                              <img
                                src={lesson.preview_image}
                                alt={lesson.title}
                                className={`w-full h-full object-cover ${
                                  !isEnrolled && !lesson.is_preview ? 'grayscale brightness-75' : ''
                                }`}
                              />
                              {!isEnrolled && !lesson.is_preview && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <Lock className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center ${
                              !isEnrolled && !lesson.is_preview ? 'grayscale brightness-75' : ''
                            }`}>
                              {isEnrolled || lesson.is_preview ? (
                                <Play className="w-4 h-4 text-gray-500" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Contenido de la lección */}
                        <div className="flex-1 p-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {lesson.lesson_number}. {lesson.title}
                              </h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                {lesson.description}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration_minutes} min</span>
                              </div>
                            </div>

                            {/* Icono de estado */}
                            <div className="flex-shrink-0 ml-2">
                              {isEnrolled || lesson.is_preview ? (
                                <div className="w-6 h-6 bg-[#85ea10] text-black rounded-full flex items-center justify-center">
                                  <Play className="w-3 h-3" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                  <Lock className="w-3 h-3 text-gray-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mensaje de bloqueo */}
                      {!isEnrolled && !lesson.is_preview && (
                        <div className="bg-gradient-to-r from-[#85ea10]/10 to-[#85ea10]/5 border-t border-[#85ea10]/20 p-2">
                          <div className="flex items-center space-x-1 text-xs text-[#85ea10] font-medium">
                            <Clock className="w-3 h-3" />
                            <span>Mañana se activará!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RogerAlert personalizada */}
      <RogerAlert
        isOpen={rogerAlert.isOpen}
        onClose={() => setRogerAlert(prev => ({ ...prev, isOpen: false }))}
        title={rogerAlert.title}
        message={rogerAlert.message}
        type={rogerAlert.type}
        confirmText="¡Entendido!"
      />

      {/* Modal de calificación */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Calificar curso
              </h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Preview del curso */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={course?.preview_image || '/placeholder-course.jpg'}
                  alt={course?.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {course?.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {course?.short_description}
                  </p>
                </div>
              </div>

              {/* Sistema de calificación */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white text-center">
                  ¿Cómo calificarías este curso?
                </h4>
                
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= userRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {userRating > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userRating === 1 && 'Muy malo'}
                      {userRating === 2 && 'Malo'}
                      {userRating === 3 && 'Regular'}
                      {userRating === 4 && 'Bueno'}
                      {userRating === 5 && 'Excelente'}
                    </p>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={submitRating}
                  disabled={userRating === 0}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    userRating > 0
                      ? 'bg-[#85ea10] hover:bg-[#7dd30f] text-black'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Enviar calificación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de pago con Wompi */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Pagar con Wompi
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Resumen del curso */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={course?.preview_image || '/placeholder-course.jpg'}
                  alt={course?.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {course?.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course?.duration_days} días • {lessons.length} lecciones
                  </p>
                  <div className="text-lg font-bold text-[#85ea10] mt-1">
                    ${course?.price.toLocaleString('es-CO')} COP
                  </div>
                </div>
              </div>

              {/* Información de pago */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Información de pago
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium">${course?.price.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Descuento</span>
                    <span className="text-green-600 font-medium">
                      -${course && course.discount_percentage > 0 ? Math.round(course.price * course.discount_percentage / 100).toLocaleString('es-CO') : '0'} COP
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#85ea10]">
                        ${course?.price.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de pago */}
              <button
                onClick={handlePayment}
                disabled={paymentStatus === 'processing'}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  paymentStatus === 'processing'
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[#85ea10] hover:bg-[#7dd30f] text-black'
                }`}
              >
                {paymentStatus === 'processing' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Redirigiendo a Wompi...</span>
                  </div>
                ) : (
                  'Ir a Pagar'
                )}
              </button>

              {/* Información de seguridad */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
                <div>🔒 Pago seguro procesado por Wompi</div>
                <div>Serás redirigido para completar tu pago</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de calendario */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                ¿Cuándo vamos a iniciar clases?
              </h3>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Información importante */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                      Recuerda que empieza a correr tus {course?.duration_days} días a partir del día que selecciones en este calendario el tiempo del curso.
                    </p>
                  </div>
                </div>
              </div>

              {/* Calendario */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Selecciona tu fecha de inicio
                </h4>
                
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {/* Días de la semana */}
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="p-2 font-medium text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                  
                  {/* Días del mes */}
                  {Array.from({ length: 31 }, (_, i) => {
                    const date = new Date();
                    date.setDate(i + 1);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = selectedStartDate?.toDateString() === date.toDateString();
                    const isPast = date < new Date();
                    
                    return (
                      <button
                        key={i}
                        onClick={() => !isPast && handleStartDateSelect(date)}
                        disabled={isPast}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          isPast
                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#85ea10] text-black font-medium'
                            : isToday
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmStartDate}
                  disabled={!selectedStartDate}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    selectedStartDate
                      ? 'bg-[#85ea10] hover:bg-[#7dd30f] text-black'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmar fecha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de compartir */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Compartir curso
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={course?.preview_image || '/placeholder-course.jpg'}
                  alt={course?.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {course?.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {course?.short_description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Compartir en redes sociales
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${course?.title} - ${course?.short_description} ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span className="text-sm font-medium">WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm font-medium">Facebook</span>
                  </a>

                  {/* Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${course?.title} - ${course?.short_description}`)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span className="text-sm font-medium">Twitter</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    O copia el enlace
                  </h4>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      id="copy-btn"
                      onClick={copyToClipboard}
                      className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

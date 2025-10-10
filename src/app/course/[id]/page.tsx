'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { Star, Clock, Users, Play, ShoppingCart, Heart, ArrowLeft, CheckCircle, Zap, Target, Award, Shield, Tag } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  thumbnail?: string;
  preview_image?: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  category?: string;
  category_name?: string;
  rating?: number;
  students_count?: number;
  lessons_count?: number;
  duration?: string;
  level?: string;
  is_published?: boolean;
  created_at?: string;
  slug?: string;
  calories_burned?: number;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url?: string;
  preview_image?: string;
  lesson_number: number;
  lesson_order: number;
  duration_minutes: number;
  is_preview: boolean;
  views_count: number;
  created_at: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [categoryMap, setCategoryMap] = useState<{ [key: string]: string }>({});
  const DESCRIPTION_LIMIT = 300; // Límite de caracteres para la descripción

  // Cargar categorías desde la base de datos
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('course_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        
        // Crear mapeo de categorías
        const map: { [key: string]: string } = {};
        (data || []).forEach(cat => {
          map[cat.id] = cat.name;
        });
        setCategoryMap(map);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryName = (categoryId: string | undefined): string => {
    if (!categoryId) return 'Sin categoría';
    return categoryMap[categoryId] || 'Sin categoría';
  };

  // Resolver parámetros de manera segura
  const resolvedParams = params || {};
  const courseId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (courseId) {
      loadCourseData();
    }
  }, [courseId, status, router]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Limpiar el ID del curso (remover parámetros de query)
      if (!courseId) {
        setError('ID del curso no encontrado');
        setLoading(false);
        return;
      }
      
      const cleanId = courseId.split('?')[0];
      console.log('🔍 Debug: cleanId =', cleanId);

      // Buscar curso por slug o UUID en la base de datos
      let course = null;
      let courseError = null;

      // Primero intentar buscar por slug
      console.log('🔍 Debug: Buscando por slug...');
      const { data: courseBySlug, error: slugError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', cleanId)
        .eq('is_published', true)
        .maybeSingle();

      console.log('🔍 Debug: courseBySlug =', courseBySlug);
      console.log('🔍 Debug: slugError =', slugError);

      if (courseBySlug && !slugError) {
        course = courseBySlug;
        console.log('✅ Debug: Curso encontrado por slug');
      } else {
        // Si no se encuentra por slug, intentar por UUID
        console.log('🔍 Debug: Buscando por UUID...');
        const { data: courseById, error: idError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', cleanId)
          .eq('is_published', true)
          .maybeSingle();

        console.log('🔍 Debug: courseById =', courseById);
        console.log('🔍 Debug: idError =', idError);

        if (courseById && !idError) {
          course = courseById;
          console.log('✅ Debug: Curso encontrado por UUID');
        } else {
          courseError = idError;
          console.log('❌ Debug: Curso no encontrado por UUID');
        }
      }

      console.log('🔍 Debug: course final =', course);
      console.log('🔍 Debug: courseError final =', courseError);

      if (courseError || !course) {
        console.log('❌ Debug: Estableciendo error - Curso no encontrado');
        setError('Curso no encontrado');
        setLoading(false);
        return;
      }

      setCourse(course);
      console.log('✅ Debug: Curso establecido correctamente');
      console.log('💰 Debug: Datos de precio:', {
        price: course.price,
        original_price: course.original_price,
        discount_percentage: course.discount_percentage
      });

      // Cargar lecciones del curso
      try {
        const { data: lessons, error: lessonsError } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', course.id)
          .order('lesson_order', { ascending: true });

        if (lessonsError) {
          console.warn('Warning: Could not load lessons:', lessonsError);
          setLessons([]);
        } else {
          setLessons(lessons || []);
        }
      } catch (error) {
        console.warn('Warning: Error loading lessons:', error);
        setLessons([]);
      }

      // Verificar si el usuario está inscrito
      if (session?.user && 'id' in session.user) {
        try {
          const { data: enrollment } = await supabase
            .from('course_purchases')
            .select('id')
            .eq('user_id', (session.user as any).id)
            .eq('course_id', course.id)
            .eq('is_active', true)
            .maybeSingle();

          setIsEnrolled(!!enrollment);
        } catch (error) {
          console.warn('Warning: Could not check enrollment status:', error);
          setIsEnrolled(false);
        }
      }

      // Verificar si es favorito
      if (session?.user && 'id' in session.user) {
        try {
          const { data: favorite } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', (session.user as any).id)
            .eq('course_id', course.id)
            .maybeSingle();

          setIsFavorite(!!favorite);
        } catch (error) {
          console.warn('Warning: Could not check favorite status:', error);
          setIsFavorite(false);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading course data:', error);
      setError('Error al cargar el curso');
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!course || !session?.user) return;

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          amount: course.price,
          originalPrice: course.original_price || course.price,
          discountAmount: course.original_price ? course.original_price - course.price : 0,
          customerEmail: (session.user as any).email,
          customerName: (session.user as any).name || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al crear la orden de pago: ${errorData.error || 'Error desconocido'}`);
      }

      const data = await response.json();
      
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('URL de pago no disponible');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 text-red-500">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Curso no encontrado</h1>
          <p className="text-gray-600 mb-6">El curso que buscas no existe o no está disponible</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 px-6 rounded-lg transition-colors duration-150"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // course.price ya tiene el descuento aplicado en la BD
  const finalPrice = course.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Video and Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={course.preview_image || course.thumbnail || '/images/course-placeholder.jpg'}
                alt={course.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
              
              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-[#85ea10] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black ml-1" />
                </button>
              </div>

              {/* RogerBox Text - TV Channel Style */}
              <div className="absolute bottom-4 right-4">
                <span className="text-white/50 font-bold text-sm tracking-wide drop-shadow-md">
                  ROGERBOX
                </span>
              </div>

            </div>

            {/* Course Title and Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {course.title}
              </h1>
              
              <div className="mb-6">
                <p className="text-gray-600 text-base leading-relaxed">
                  {showFullDescription || course.description.length <= DESCRIPTION_LIMIT
                    ? course.description
                    : `${course.description.substring(0, DESCRIPTION_LIMIT)}...`
                  }
                </p>
                {course.description.length > DESCRIPTION_LIMIT && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-[#85ea10] hover:text-[#7dd30f] font-semibold text-sm mt-2 transition-colors"
                  >
                    {showFullDescription ? 'Leer menos' : 'Leer más'}
                  </button>
                )}
              </div>


              {/* Course Details & Purchase - Unified Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                {/* Course Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#85ea10]" />
                    <span className="text-sm text-gray-600">Duración:</span>
                    <span className="text-sm font-semibold text-gray-900">{course.duration || '40 min'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-[#85ea10]" />
                    <span className="text-sm text-gray-600">Calificación:</span>
                    <span className="text-sm font-semibold text-gray-900 flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{course.rating || '4.8'}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#85ea10]" />
                    <span className="text-sm text-gray-600">Estudiantes:</span>
                    <span className="text-sm font-semibold text-gray-900">{course.students_count?.toLocaleString() || '0'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4 text-[#85ea10]" />
                    <span className="text-sm text-gray-600">Clases:</span>
                    <span className="text-sm font-semibold text-gray-900">{lessons.length}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-[#85ea10]" />
                    <span className="text-sm text-gray-600">Calorías:</span>
                    <span className="text-sm font-semibold text-gray-900">{course.calories_burned ? `${course.calories_burned}+ quemadas` : '500+ quemadas'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-[#85ea10]" />
                    <span className="text-sm text-gray-600">Enfoque:</span>
                    <span className="text-sm font-semibold text-gray-900">{getCategoryName(course.category)}</span>
                  </div>
                </div>

                {/* Purchase Section */}
                <div className="border-t border-gray-200 pt-6">
                  {course.original_price && course.original_price > course.price ? (
                    <div className="space-y-4">
                      {/* Pricing - Clean Layout */}
                      <div className="text-center space-y-2">
                        <div className="text-2xl text-gray-500 line-through">
                          ${course.original_price.toLocaleString('es-CO')}
                        </div>
                        <div className="text-4xl font-black text-gray-900">
                          ${finalPrice.toLocaleString('es-CO')}
                        </div>
                        <div className="text-lg text-[#85ea10] font-bold">
                          ¡Ahorras ${(course.original_price - finalPrice).toLocaleString('es-CO')}!
                        </div>
                      </div>
                      
                      {/* Purchase Button */}
                      <button
                        onClick={handlePurchase}
                        className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-black py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>¡COMPRAR AHORA!</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Pricing - Clean Layout */}
                      <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-gray-900">
                          ${course.price.toLocaleString('es-CO')}
                        </div>
                        <div className="text-sm text-gray-500">
                          Pago único • Sin suscripciones
                        </div>
                      </div>
                      
                      {/* Purchase Button */}
                      <button
                        onClick={handlePurchase}
                        className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-black py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>¡COMPRAR AHORA!</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Lessons and Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Classes List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col">
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-4 flex-shrink-0">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-green-800 mb-1">
                      💪 CÓMO FUNCIONA TU CURSO
                    </h4>
                    <p className="text-xs text-green-700 leading-relaxed">
                      Al comprar, eliges cuándo empezar. Cada día se desbloquea una nueva clase. ¡Mantén la constancia para no perderte ninguna!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Contenido del Curso
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto">
                {lessons.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {lessons.map((lesson, index) => {
                      // Simular estados basados en la fecha actual (simulación realista)
                      const today = new Date();
                      const courseStartDate = new Date(today); // Simular que el curso empezó hoy
                      const classDate = new Date(courseStartDate);
                      classDate.setDate(courseStartDate.getDate() + index);
                      
                      let classStatus;
                      if (index === 0) {
                        classStatus = 'available'; // Primera clase siempre disponible hoy
                      } else if (index === 1) {
                        classStatus = 'tomorrow'; // Segunda clase disponible mañana
                      } else {
                        classStatus = 'upcoming'; // Resto de clases en días futuros
                      }
                      
                      return (
                        <div key={lesson.id} className={`p-4 transition-colors ${
                          classStatus === 'available' 
                            ? 'hover:bg-green-50 cursor-pointer' 
                            : 'hover:bg-gray-50 cursor-pointer'
                        }`}>
                          <div className="flex items-start space-x-3">
                            {/* Class Image */}
                            <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-gray-200">
                              <img
                                src={lesson.preview_image || '/images/lessons/placeholder.jpg'}
                                alt={lesson.title}
                                className={`w-full h-full object-cover ${
                                  classStatus === 'available' ? '' : 'grayscale opacity-70'
                                }`}
                                onError={(e) => {
                                  e.currentTarget.src = '/images/course-placeholder.jpg';
                                }}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              {/* Class Number and Title */}
                              <div className="flex items-start space-x-2 mb-1">
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                  classStatus === 'available' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-400 text-white'
                                }`}>
                                  {lesson.lesson_number}
                                </div>
                                <h4 className={`text-sm font-semibold line-clamp-2 flex-1 ${
                                  classStatus === 'available' ? 'text-gray-900' : 'text-gray-600'
                                }`}>
                                  {lesson.title}
                                </h4>
                              </div>
                              
                              {lesson.description && (
                                <p className={`text-xs mb-2 line-clamp-2 ml-7 ${
                                  classStatus === 'available' ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                  {lesson.description}
                                </p>
                              )}
                              
                              {/* Status Text */}
                              <div className="mb-2 ml-7">
                                {classStatus === 'available' && (
                                  <span className="text-xs text-green-600 font-medium">✅ Disponible hoy</span>
                                )}
                                {classStatus === 'tomorrow' && (
                                  <span className="text-xs text-gray-500 font-medium">⏰ Disponible mañana</span>
                                )}
                                {classStatus === 'upcoming' && (
                                  <span className="text-xs text-gray-500 font-medium">📅 Próximamente</span>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-3 text-xs text-gray-500 ml-7">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration_minutes} min</span>
                                </div>
                                {lesson.is_preview && classStatus === 'available' && (
                                  <div className="flex items-center space-x-1 text-green-600">
                                    <Play className="w-3 h-3" />
                                    <span>Preview</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No hay clases disponibles</p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
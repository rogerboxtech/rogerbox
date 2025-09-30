'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Users, Star, Search, ArrowRight, User, BookOpen, Award, TrendingUp, Zap, Utensils, Target, CheckCircle, ShoppingCart } from 'lucide-react';
import QuickLoading from '@/components/QuickLoading';
import Footer from '@/components/Footer';
import { trackCourseView } from '@/lib/analytics';
import { useFastCourses } from '@/hooks/useFastCourses';

interface Course {
  id: string;
  title: string;
  short_description?: string;
  description: string;
  preview_image?: string | null;
  price: number;
  discount_percentage?: number;
  category: string;
  category_name?: string;
  duration_days: number;
  students_count: number;
  students?: number;
  rating: number;
  calories_burned?: number;
  level: string;
  is_published?: boolean;
  created_at?: string;
  // Campos adicionales para la UI
  instructor?: string;
  lessons?: number;
  isNew?: boolean;
  isPopular?: boolean;
  originalPrice?: number;
  thumbnail?: string;
  tags?: string[];
  whatYouWillLearn?: string[];
  requirements?: string[];
}


export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Usar el hook ULTRA RÁPIDO
  const { courses, loading: loadingCourses, error: coursesError } = useFastCourses();

  // Si el usuario está autenticado, redirigir al dashboard
  if (status === 'authenticated') {
    router.push('/dashboard');
    return <QuickLoading message="Cargando..." duration={3000} />;
  }

  // Si está cargando la sesión, mostrar loading
  if (status === 'loading') {
    return <QuickLoading message="Cargando..." duration={3000} />;
  }


  // Mostrar todos los cursos sin filtros
  const displayedCourses = courses;

  const getSectionTitle = () => {
    return 'Nuestros Cursos';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="flex items-center space-x-3 hover:scale-105 hover:opacity-90 transition-all duration-300 ease-out group"
              >
                <h1 className="text-3xl font-black text-white group-hover:text-[#85ea10] transition-colors duration-300 uppercase tracking-wider">
                  ROGER<span className="text-[#85ea10] group-hover:text-white transition-colors duration-300">BOX</span>
                </h1>
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/#cursos" className="text-white/80 hover:text-white transition-colors">Cursos</a>
              <a href="/about" className="text-white/80 hover:text-white transition-colors">Qué es RogerBox</a>
              <a href="/enterprises" className="text-white/80 hover:text-white transition-colors">Servicio para Empresas</a>
              <a href="/contact" className="text-white/80 hover:text-white transition-colors">Contacto</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-wider">
              QUEMA GRASA CON{' '}
              <span className="text-[#85ea10]">ENTRENAMIENTOS INTENSOS</span>
            </h1>
            <p className="text-lg text-white/80 mb-4 max-w-3xl mx-auto">
              Compra tu curso, elige tu fecha de inicio y cada día se desbloquea una nueva clase. 
              ¡Empieza ya y quema grasa con entrenamientos HIIT efectivos!
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Courses Grid */}
          {loadingCourses ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Cargando cursos...
              </h3>
              <p className="text-white/60">
                Estamos preparando los mejores cursos para ti
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCourses.map(course => (
              <div key={course.id} className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:shadow-[#85ea10]/5 hover:scale-[1.01] hover:bg-white/12 transition-all duration-150 ease-out flex flex-col">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src={course.thumbnail || course.preview_image || '/images/course-placeholder.jpg'} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/course-placeholder.jpg';
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-[#85ea10]/20 to-[#85ea10]/40 flex items-center justify-center">
                      <Play className="w-12 h-12 text-[#85ea10]" />
                    </div>
                  </div>
                  
                  {/* Etiquetas POPULAR/NUEVO */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {course.isPopular && (
                      <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        POPULAR
                      </div>
                    )}
                    {course.isNew && (
                      <div className="bg-[#85ea10] text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        NUEVO
                      </div>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  {/* Información de calorías y clases */}
                  <h3 className="text-xl font-bold course-title text-white mb-2">{course.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{course.short_description || course.description}</p>
                  
                  {/* Cuadro verde unificado */}
                  <div className="bg-[#85ea10]/10 rounded-lg p-4 mb-4 flex-grow flex flex-col justify-center">
                    {/* Categoría del curso */}
                    <div className="flex items-center justify-center mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#85ea10] text-black">
                        {course.category_name || 'Sin categoría'}
                      </span>
                    </div>
                    
                    {/* Mensaje motivacional */}
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Zap className="w-4 h-4 text-[#85ea10]" />
                      <span className="text-sm font-semibold text-white">
                        ¡Sin límites! Para todos los niveles
                      </span>
                    </div>
                    
                    {/* Estadísticas del curso */}
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-[#85ea10]" />
                        <span>{course.students_count || 0} estudiantes</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Play className="w-3 h-3" />
                        <span>{course.lessons_count || 1} clases</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration || '30 min'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{course.level || 'Intermedio'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Precio */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        {course.original_price ? (
                          <>
                            <span className="text-2xl font-bold text-white">
                              ${course.price?.toLocaleString('es-CO')}
                            </span>
                            <span className="text-lg text-white/50 line-through">
                              ${course.original_price?.toLocaleString('es-CO')}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            ${course.price?.toLocaleString('es-CO')}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        {course.original_price && (
                          <span className="text-sm text-[#85ea10] font-semibold">
                            {course.discount_percentage}% de descuento
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Botón */}
                    <button
                      onClick={async () => {
                        // Trackear la visita al curso
                        await trackCourseView(course.id);
                        router.push(`/course/${course.id}`);
                      }}
                      className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 rounded-lg transition-colors duration-150 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>¡Comenzar Ahora!</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {!loadingCourses && displayedCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No se encontraron cursos
              </h3>
              <p className="text-white/60">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </section>


      {/* Nutrition Plans Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Planes <span className="text-[#85ea10]">Nutricionales</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Complementa tu entrenamiento con planes alimentarios personalizados diseñados por expertos en nutrición
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="bg-white/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#85ea10] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Plan Básico
                </h3>
                <p className="text-white/80">
                  Ideal para comenzar tu transformación
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Plan nutricional personalizado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Recetas semanales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Lista de compras</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Seguimiento semanal</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-[#85ea10] mb-2">$50.000</div>
                <div className="text-white/60 text-sm mb-4">por mes</div>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Solicitar Plan
                </button>
              </div>
            </div>

            {/* Plan Avanzado */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#85ea10] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#85ea10] text-black px-4 py-2 rounded-full text-sm font-bold">
                  MÁS POPULAR
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#85ea10] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Plan Avanzado
                </h3>
                <p className="text-white/80">
                  Para objetivos específicos
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Todo del Plan Básico</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Análisis de composición corporal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Ajustes semanales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Consultas ilimitadas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Suplementación personalizada</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-[#85ea10] mb-2">$100.000</div>
                <div className="text-white/60 text-sm mb-4">por mes</div>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Solicitar Plan
                </button>
              </div>
            </div>

            {/* Plan Premium */}
            <div className="bg-white/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#85ea10] to-[#7dd30f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Plan Premium
                </h3>
                <p className="text-white/80">
                  Transformación completa
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Todo del Plan Avanzado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Sesiones 1:1 con nutricionista</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Plan de suplementos incluido</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Seguimiento diario</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-white/80">Garantía de resultados</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-[#85ea10] mb-2">$150.000</div>
                <div className="text-white/60 text-sm mb-4">por mes</div>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Solicitar Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Users, Star, Search, ArrowRight, User, BookOpen, Award, TrendingUp, Zap, Utensils, Target, CheckCircle, ShoppingCart, Flame, Dumbbell, Home } from 'lucide-react';
import QuickLoading from '@/components/QuickLoading';
import Footer from '@/components/Footer';
import { trackCourseView } from '@/lib/analytics';
import { useUnifiedCourses } from '@/hooks/useUnifiedCourses';

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
  original_price?: number;
  thumbnail?: string;
  tags?: string[];
  whatYouWillLearn?: string[];
  requirements?: string[];
}


export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Usar el hook ULTRA RÁPIDO
  const { courses, loading: loadingCourses, error: coursesError } = useUnifiedCourses();
  
  // Estado para controlar el navbar
  const [isScrolled, setIsScrolled] = useState(false);

  // Redirigir al dashboard si el usuario está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Efecto para detectar scroll y cambiar navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      
      // Cambiar navbar cuando se hace scroll más allá del 80% del hero
      setIsScrolled(scrollPosition > heroHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Si está cargando la sesión, mostrar loading
  if (status === 'loading') {
    return <QuickLoading message="Cargando..." duration={3000} />;
  }

  // Si el usuario está autenticado, mostrar loading mientras redirige
  if (status === 'authenticated') {
    return <QuickLoading message="Redirigiendo al dashboard..." duration={3000} />;
  }


  // Mostrar todos los cursos sin filtros
  const displayedCourses = courses;

  const getSectionTitle = () => {
    return 'Nuestros Cursos';
  };


  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Video Background - Fixed behind hero and navbar only */}
      <div className="fixed inset-0 z-0" style={{ height: '100vh' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/roger-hero.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-lg transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 border-b border-gray-200' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="flex items-center space-x-3 hover:scale-105 hover:opacity-90 transition-all duration-300 ease-out group"
              >
                <h1 className={`text-3xl font-black group-hover:text-[#85ea10] transition-colors duration-300 uppercase tracking-tight ${
                  isScrolled 
                    ? 'text-gray-900 drop-shadow-none' 
                    : 'text-white drop-shadow-sm'
                }`}>
                  ROGER<span className={`group-hover:text-white transition-colors duration-300 ${
                    isScrolled ? 'text-[#85ea10]' : 'text-[#85ea10] drop-shadow-sm'
                  }`}>BOX</span>
                </h1>
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/#cursos" className={`transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}>Cursos</a>
              <a href="/about" className={`transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}>Qué es RogerBox</a>
              <a href="/enterprises" className={`transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}>Servicio para Empresas</a>
              <a href="/contact" className={`transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}>Contacto</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className={`transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 pb-8">
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 md:space-y-8">
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight leading-tight">
              <span className="drop-shadow-md">QUEMA GRASA CON</span>{' '}
              <span className="text-[#85ea10] drop-shadow-md">ENTRENAMIENTOS HIIT</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/95 mb-6 md:mb-8 max-w-4xl mx-auto font-medium leading-relaxed">
              Transforma tu cuerpo con entrenamientos intensos de alta calidad. 
              <br className="hidden md:block" />
              <span className="text-[#85ea10] font-bold">¡Cada día una nueva clase te espera!</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/register')}
                className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-black px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-[#85ea10]/25"
              >
                ¡EMPEZAR AHORA!
              </button>
              <button
                onClick={() => document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105 border border-white/30"
              >
                Ver Cursos
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center mb-2 md:mb-3">
                  <Flame className="w-8 h-8 md:w-12 md:h-12 text-[#85ea10]" />
                </div>
                <div className="text-white font-semibold text-sm md:text-lg mb-1 md:mb-2">Quema de Grasa</div>
                <div className="text-white/80 text-xs md:text-sm">Resultados visibles en 2 semanas</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2 md:mb-3">
                  <Dumbbell className="w-8 h-8 md:w-12 md:h-12 text-[#85ea10]" />
                </div>
                <div className="text-white font-semibold text-sm md:text-lg mb-1 md:mb-2">Mejor Estado Físico</div>
                <div className="text-white/80 text-xs md:text-sm">Fuerza y resistencia</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2 md:mb-3">
                  <Home className="w-8 h-8 md:w-12 md:h-12 text-[#85ea10]" />
                </div>
                <div className="text-white font-semibold text-sm md:text-lg mb-1 md:mb-2">Desde Casa</div>
                <div className="text-white/80 text-xs md:text-sm">Sin gimnasio, sin excusas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="py-16 pb-8 bg-white dark:bg-gray-900 relative z-10 min-h-screen">
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
              <div 
                key={course.id} 
                onClick={(e) => {
                  console.log('🖱️ Landing card clicked:', course.title);
                  console.log('🖱️ Landing course slug:', course.slug);
                  console.log('🖱️ Landing course ID:', course.id);
                  router.push(`/course/${course.slug || course.id}`);
                }}
                className="bg-white dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:shadow-[#85ea10]/5 hover:scale-[1.01] hover:bg-gray-50 dark:hover:bg-white/12 transition-all duration-150 ease-out flex flex-col cursor-pointer"
              >
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
                  
                  {/* Rating - Movido abajo para mejor visibilidad */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">{course.rating}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  {/* Información de calorías y clases */}
                  <h3 className="text-xl font-bold course-title text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-gray-700 dark:text-white/70 text-sm mb-3">{course.short_description || course.description}</p>
                  
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
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ¡Sin límites! Para todos los niveles
                      </span>
                    </div>
                    
                    {/* Estadísticas del curso */}
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-white/70">
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
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              ${course.price?.toLocaleString('es-CO')}
                            </span>
                            <span className="text-lg text-gray-500 dark:text-white/50 line-through">
                              ${course.original_price?.toLocaleString('es-CO')}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
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
                      onClick={async (e) => {
                        e.stopPropagation();
                        // Trackear la visita al curso
                        await trackCourseView(course.id);
                        router.push(`/course/${course.slug || course.id}`);
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
      <section className="py-20 bg-gray-50 dark:bg-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Planes <span className="text-[#85ea10]">Nutricionales</span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-white/80 max-w-3xl mx-auto">
              Complementa tu entrenamiento con planes alimentarios personalizados diseñados por expertos en nutrición
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="bg-white dark:bg-white/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#85ea10] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Plan Básico
                </h3>
                <p className="text-gray-700 dark:text-white/80">
                  Ideal para comenzar tu transformación
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Plan nutricional personalizado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Recetas semanales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Lista de compras</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Seguimiento semanal</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-black text-[#85ea10] mb-2">$50.000</div>
                <div className="text-gray-600 dark:text-white/60 text-sm mb-4">por mes</div>
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Plan Avanzado
                </h3>
                <p className="text-gray-700 dark:text-white/80">
                  Para objetivos específicos
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Todo del Plan Básico</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Análisis de composición corporal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Ajustes semanales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Consultas ilimitadas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Suplementación personalizada</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-black text-[#85ea10] mb-2">$100.000</div>
                <div className="text-gray-600 dark:text-white/60 text-sm mb-4">por mes</div>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Solicitar Plan
                </button>
              </div>
            </div>

            {/* Plan Premium */}
            <div className="bg-white dark:bg-white/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#85ea10] to-[#7dd30f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Plan Premium
                </h3>
                <p className="text-gray-700 dark:text-white/80">
                  Transformación completa
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Todo del Plan Avanzado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Sesiones 1:1 con nutricionista</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Plan de suplementos incluido</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Seguimiento diario</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#85ea10] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-white/80">Garantía de resultados</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-black text-[#85ea10] mb-2">$150.000</div>
                <div className="text-gray-600 dark:text-white/60 text-sm mb-4">por mes</div>
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

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
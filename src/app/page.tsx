'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Users, Star, Filter, Search, ArrowRight, User, BookOpen, Award, TrendingUp, Zap, Utensils, Target, CheckCircle } from 'lucide-react';
import QuickLoading from '@/components/QuickLoading';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface Course {
  id: string;
  title: string;
  short_description?: string;
  description: string;
  preview_image?: string | null;
  price: number;
  discount_percentage?: number;
  category: string;
  duration_days: number;
  students_count: number;
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

const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Transformación Total 90 Días',
    short_description: 'Programa completo de transformación física en 90 días',
    description: 'Programa completo de transformación física en 90 días con desbloqueo diario de clases.',
    preview_image: '/images/curso-transformacion.jpg',
    instructor: 'RogerBox',
    category: 'Pérdida de Peso',
    duration_days: 90,
    level: 'Intermedio',
    rating: 4.9,
    students_count: 2847,
    price: 89,
    originalPrice: 149,
    thumbnail: '/images/curso-transformacion.jpg',
    lessons: 90,
    isNew: true,
    isPopular: true,
    discount_percentage: 40,
    calories_burned: 500,
    is_published: true,
    created_at: new Date().toISOString(),
    tags: ['Pérdida de Peso', 'Cardio', 'Alimentación', 'Motivación'],
    whatYouWillLearn: [
      'Técnicas de cardio efectivas',
      'Plan nutricional balanceado',
      'Rutinas de fuerza',
      'Manejo del estrés'
    ],
    requirements: [
      'Ropa cómoda para ejercicio',
      'Espacio para moverse',
      'Motivación y constancia'
    ]
  },
  {
    id: '2',
    title: 'HIIT Quema Grasa',
    instructor: 'RogerBox',
    category: 'HIIT',
    duration_days: 21,
    level: 'Avanzado',
    rating: 4.7,
    students_count: 1456,
    price: 69,
    originalPrice: 99,
    thumbnail: '/images/curso-hiit.jpg',
    description: 'Entrenamiento de alta intensidad para quemar grasa y tonificar músculos.',
    lessons: 21,
    isNew: true,
    isPopular: false,
    discount_percentage: 30,
    tags: ['HIIT', 'Quema de Grasa', 'Alta Intensidad'],
    whatYouWillLearn: [
      'Ejercicios de alta intensidad',
      'Técnicas de respiración',
      'Intervalos efectivos',
      'Recuperación activa'
    ],
    requirements: [
      'Buen estado físico',
      'Espacio amplio',
      'Cronómetro'
    ]
  },
  {
    id: '3',
    title: 'Fuerza y Músculo',
    instructor: 'RogerBox',
    category: 'Fuerza',
    duration_days: 60,
    level: 'Intermedio',
    rating: 4.8,
    students_count: 1923,
    price: 79,
    originalPrice: 119,
    thumbnail: '/images/curso-fuerza.jpg',
    description: 'Desarrolla fuerza muscular con ejercicios progresivos y técnicas avanzadas.',
    lessons: 60,
    isNew: false,
    isPopular: true,
    discount_percentage: 34,
    tags: ['Fuerza', 'Músculo', 'Progresión'],
    whatYouWillLearn: [
      'Técnicas de levantamiento',
      'Progresión de cargas',
      'Anatomía muscular',
      'Prevención de lesiones'
    ],
    requirements: [
      'Pesas o bandas de resistencia',
      'Colchoneta',
      'Consistencia'
    ]
  },
  {
    id: '4',
    title: 'Cardio Intenso',
    instructor: 'RogerBox',
    category: 'Cardio',
    duration_days: 30,
    level: 'Avanzado',
    rating: 4.9,
    students_count: 2156,
    price: 59,
    originalPrice: 89,
    thumbnail: '/images/curso-cardio.jpg',
    description: 'Entrenamientos cardiovasculares de alta intensidad para llevar tu resistencia al límite.',
    lessons: 30,
    isNew: false,
    isPopular: true,
    discount_percentage: 34,
    tags: ['Cardio', 'Resistencia', 'Condición Física'],
    whatYouWillLearn: [
      'Ejercicios cardiovasculares',
      'Control de frecuencia cardíaca',
      'Técnicas de respiración',
      'Endurance training'
    ],
    requirements: [
      'Ropa deportiva',
      'Espacio para correr',
      'Monitor de frecuencia cardíaca'
    ]
  },
  {
    id: '5',
    title: 'Tonificación Total',
    instructor: 'RogerBox',
    category: 'Tonificación',
    duration_days: 45,
    level: 'Intermedio',
    rating: 4.6,
    students_count: 1543,
    price: 69,
    originalPrice: 99,
    thumbnail: '/images/curso-tonificacion.jpg',
    description: 'Define y tonifica tu cuerpo con ejercicios específicos para cada grupo muscular.',
    lessons: 45,
    isNew: false,
    isPopular: false,
    discount_percentage: 30,
    tags: ['Tonificación', 'Definición', 'Resistencia'],
    whatYouWillLearn: [
      'Ejercicios de tonificación',
      'Técnicas de definición',
      'Rutinas específicas',
      'Mantenimiento'
    ],
    requirements: [
      'Pesas ligeras',
      'Colchoneta',
      'Disciplina'
    ]
  },
  {
    id: '6',
    title: 'Ganancia Muscular',
    instructor: 'RogerBox',
    category: 'Músculo',
    duration_days: 75,
    level: 'Avanzado',
    rating: 4.8,
    students_count: 987,
    price: 99,
    originalPrice: 149,
    thumbnail: '/images/curso-musculo.jpg',
    description: 'Maximiza tu crecimiento muscular con ejercicios de alta intensidad.',
    lessons: 75,
    isNew: true,
    isPopular: false,
    discount_percentage: 34,
    tags: ['Músculo', 'Hipertrofia', 'Progresión'],
    whatYouWillLearn: [
      'Técnicas de hipertrofia',
      'Periodización',
      'Nutrición para músculo',
      'Recuperación'
    ],
    requirements: [
      'Equipamiento completo',
      'Plan nutricional',
      'Descanso adecuado'
    ]
  }
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformar los datos para que coincidan con la interfaz
      const transformedCourses = (data || []).map(course => ({
        ...course,
        instructor: 'RogerBox',
        lessons: 1, // Por ahora, asumimos 1 lección por curso
        isNew: new Date(course.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Nuevo si fue creado en los últimos 7 días
        isPopular: course.students_count > 100,
        originalPrice: course.discount_percentage > 0 ? Math.round(course.price / (1 - course.discount_percentage / 100)) : undefined,
        thumbnail: course.preview_image,
        tags: [course.category],
        whatYouWillLearn: [
          'Técnicas de ejercicio efectivas',
          'Plan nutricional balanceado',
          'Rutinas personalizadas',
          'Motivación y constancia'
        ],
        requirements: [
          'Ropa cómoda para ejercicio',
          'Espacio para moverse',
          'Motivación y constancia'
        ]
      }));
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      // En caso de error, usar los cursos de muestra
      setCourses(sampleCourses);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Cargar cursos al montar el componente
  useEffect(() => {
    loadCourses();
  }, []);

  // Si el usuario está autenticado, redirigir al dashboard
  if (status === 'authenticated') {
    router.push('/dashboard');
    return <QuickLoading message="Cargando..." duration={3000} />;
  }

  // Si está cargando la sesión, mostrar loading
  if (status === 'loading') {
    return <QuickLoading message="Cargando..." duration={3000} />;
  }

  const categories = [
    { id: 'all', name: 'Todos', emoji: '🌟' },
    { id: 'Transformación Intensa', name: 'Transformación Intensa', emoji: '🔥' },
    { id: 'HIIT Avanzado', name: 'HIIT Avanzado', emoji: '⚡' },
    { id: 'Cardio Intenso', name: 'Cardio Intenso', emoji: '🏃' },
    { id: 'Fuerza Funcional', name: 'Fuerza Funcional', emoji: '💪' },
    { id: 'Entrenamiento en Casa', name: 'Entrenamiento en Casa', emoji: '🏠' },
    { id: 'Rutina Matutina', name: 'Rutina Matutina', emoji: '🌅' },
    { id: 'Sesión Nocturna', name: 'Sesión Nocturna', emoji: '🌙' },
    { id: 'Entrenamiento Express', name: 'Entrenamiento Express', emoji: '⚡' },
    { id: 'Complementos', name: 'Complementos', emoji: '💊' }
  ];

  const sortOptions = [
    { id: 'newest', name: 'Más Recientes', emoji: '🆕' },
    { id: 'popular', name: 'Más Populares', emoji: '🔥' },
    { id: 'rating', name: 'Mejor Calificados', emoji: '⭐' },
    { id: 'price-low', name: 'Precio: Menor a Mayor', emoji: '💰' },
    { id: 'price-high', name: 'Precio: Mayor a Menor', emoji: '💎' }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (selectedSort) {
      case 'newest':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'popular':
        return b.students_count - a.students_count;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const getSectionTitle = () => {
    switch (selectedSort) {
      case 'newest':
        return 'Nuevos Cursos';
      case 'popular':
        return 'Más Populares';
      case 'rating':
        return 'Mejor Calificados';
      case 'price-low':
        return 'Precios Accesibles';
      case 'price-high':
        return 'Cursos Premium';
      default:
        return 'Todos los Cursos';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#164151]/80 dark:via-[#29839c]/70 dark:to-[#29839c]/60">
      {/* Header */}
      <header className="bg-transparent border-b border-gray-200 dark:border-white/20 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="flex items-center space-x-3 hover:scale-105 hover:opacity-90 transition-all duration-300 ease-out group"
              >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-[#85ea10] transition-colors duration-300">
                  ROGER<span className="text-[#85ea10] group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">BOX</span>
                </h1>
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/#cursos" className="text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors">Cursos</a>
              <a href="/about" className="text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors">Qué es RogerBox</a>
              <a href="/enterprises" className="text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors">Servicio para Empresas</a>
              <a href="/contact" className="text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors">Contacto</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors"
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quema grasa con{' '}
              <span className="text-[#85ea10]">entrenamientos intensos</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-white/80 mb-4 max-w-3xl mx-auto">
              Compra tu curso, elige tu fecha de inicio y cada día se desbloquea una nueva clase. 
              ¡Empieza ya y quema grasa con entrenamientos HIIT efectivos!
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search and Filters */}
          <div className="mb-12">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:border-[#85ea10] backdrop-blur-lg"
              />
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-4 h-4 text-gray-500 dark:text-white/60" />
                <span className="text-gray-700 dark:text-white/80 font-medium">Categorías:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 font-medium text-sm ${
                      selectedCategory === category.id
                        ? 'bg-[#85ea10] text-black border-[#85ea10] shadow-lg'
                        : 'bg-white/80 dark:bg-white/10 text-gray-700 dark:text-white border-gray-200 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/15 hover:border-[#85ea10]/30'
                    }`}
                  >
                    <span className="text-base">{category.emoji}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-white/80 font-medium">Ordenar por:</span>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedSort(option.id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedSort === option.id
                        ? 'bg-[#85ea10] text-black'
                        : 'bg-white/80 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/15'
                    }`}
                  >
                    <span>{option.emoji}</span>
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/15 hover:border-[#85ea10]/30 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer group shadow-lg dark:shadow-none"
                onClick={() => router.push(`/course/${course.id}`)}
              >
                {/* Course Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-[#85ea10]/20 to-[#7dd30f]/20">
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white/40" />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {course.isNew && (
                      <div className="bg-[#85ea10] text-black px-3 py-1.5 rounded-lg text-xs font-black tracking-wide shadow-lg border-2 border-black/20">
                        NUEVO
                      </div>
                    )}
                    {course.isPopular && (
                      <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                        POPULAR
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    {course.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#85ea10] text-sm font-semibold">
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white/60 text-sm">{course.rating}</span>
                      <span className="text-white/40 text-sm">({Math.floor(course.rating * 200)})</span>
                    </div>
                  </div>

                  <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2 group-hover:text-[#85ea10] transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-white/60 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="w-4 h-4 text-gray-500 dark:text-white/60" />
                    <span className="text-gray-700 dark:text-white/80 text-sm">{course.instructor}</span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-white/60 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students_count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons} clases</span>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-200 dark:bg-white/20 px-2 py-1 rounded text-gray-700 dark:text-white">
                      {course.level}
                    </span>
                  </div>

                  {/* Price and Purchase Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-[#85ea10] font-bold text-2xl">
                        ${course.price}
                      </div>
                      {course.originalPrice && (
                        <div className="text-gray-500 dark:text-white/60 line-through text-lg">
                          ${course.originalPrice}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/course/${course.id}`);
                      }}
                      className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Ver Curso</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {!loadingCourses && sortedCourses.length === 0 && (
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#85ea10]/10 to-[#7dd30f]/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            ¿Listo para transformar tu vida?
          </h2>
          <p className="text-xl text-gray-600 dark:text-white/80 mb-8">
            Únete a miles de estudiantes que ya están transformando sus cuerpos con nuestros cursos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/register')}
              className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="border-2 border-[#85ea10] text-[#85ea10] hover:bg-[#85ea10] hover:text-black font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300"
            >
              Consulta Personalizada
            </button>
          </div>
        </div>
      </section>

      {/* Nutrition Plans Section */}
      <section className="py-20 bg-white/50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Planes <span className="text-[#85ea10]">Nutricionales</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/80 max-w-3xl mx-auto">
              Complementa tu entrenamiento con planes alimentarios personalizados diseñados por expertos en nutrición
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#85ea10] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Plan Básico
                </h3>
                <p className="text-gray-600 dark:text-white/80">
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
                <div className="text-3xl font-bold text-[#85ea10] mb-2">$50.000</div>
                <div className="text-gray-500 dark:text-white/60 text-sm mb-4">por mes</div>
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
                <p className="text-gray-600 dark:text-white/80">
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
                <div className="text-3xl font-bold text-[#85ea10] mb-2">$100.000</div>
                <div className="text-gray-500 dark:text-white/60 text-sm mb-4">por mes</div>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Solicitar Plan
                </button>
              </div>
            </div>

            {/* Plan Premium */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-white/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#85ea10] to-[#7dd30f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Plan Premium
                </h3>
                <p className="text-gray-600 dark:text-white/80">
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
                <div className="text-3xl font-bold text-[#85ea10] mb-2">$150.000</div>
                <div className="text-gray-500 dark:text-white/60 text-sm mb-4">por mes</div>
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
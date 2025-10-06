'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Play, Clock, Users, Star, Filter, Search, User, LogOut, ChevronDown, ShoppingCart, Heart, BookOpen, Target, Zap, Utensils, ChefHat, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Footer from '@/components/Footer';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  height: number;
  weight: number;
  gender: string;
  goals: string[];
  target_weight: number | null;
  membership_status: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
  description: string;
  lessons: number;
  isRecommended?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Obtener datos del perfil desde Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if ((session as any)?.user?.id) {
        try {
          console.log('Dashboard: Buscando perfil para ID:', (session as any).user.id);
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', (session as any).user.id)
            .maybeSingle();

          // Si no hay perfil o el perfil está incompleto, redirigir al onboarding
          if (!data || !data.goals || data.goals.length === 0) {
            console.log('Dashboard: Perfil incompleto o no encontrado, redirigiendo al onboarding');
            router.push('/onboarding');
            return;
          }

          if (error) {
            console.error('Dashboard: Error fetching profile:', error);
            setLoading(false);
            return;
          }

          console.log('Dashboard: Perfil encontrado:', data);
          setUserProfile(data);
          setLoading(false);
        } catch (error) {
          console.error('Dashboard: Error inesperado:', error);
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [session, status, router]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🎯' },
    { id: 'lose_weight', name: 'Bajar de Peso', icon: '🔥' },
    { id: 'tone', name: 'Tonificar', icon: '💪' },
    { id: 'gain_muscle', name: 'Ganar Músculo', icon: '🏋️' },
    { id: 'endurance', name: 'Resistencia', icon: '🏃' },
    { id: 'hiit', name: 'HIIT', icon: '⚡' },
    { id: 'strength', name: 'Fuerza', icon: '💪' }
  ];

  const courses: Course[] = [
    {
      id: '1',
      title: 'Transformación Total 90 Días',
      instructor: 'RogerBox',
      category: 'lose_weight',
      duration: '90 días',
      level: 'Intermedio',
      rating: 4.9,
      students: 2847,
      price: 89,
      thumbnail: '/images/curso-transformacion.jpg',
      description: 'Programa completo de transformación física en 90 días con desbloqueo diario de clases.',
      lessons: 90,
      isRecommended: userProfile?.goals?.includes('lose_weight') || false
    },
    {
      id: '2',
      title: 'HIIT Quema Grasa',
      instructor: 'RogerBox',
      category: 'hiit',
      duration: '21 días',
      level: 'Avanzado',
      rating: 4.7,
      students: 1456,
      price: 69,
      thumbnail: '/images/curso-hiit.jpg',
      description: 'Entrenamiento de alta intensidad para quemar grasa y tonificar músculos.',
      lessons: 21,
      isRecommended: userProfile?.goals?.includes('hiit') || false
    },
    {
      id: '3',
      title: 'Fuerza y Músculo',
      instructor: 'RogerBox',
      category: 'strength',
      duration: '60 días',
      level: 'Intermedio',
      rating: 4.8,
      students: 1923,
      price: 79,
      thumbnail: '/images/curso-fuerza.jpg',
      description: 'Desarrolla fuerza muscular con ejercicios progresivos y técnicas avanzadas.',
      lessons: 60,
      isRecommended: userProfile?.goals?.includes('strength') || false
    },
    {
      id: '4',
      title: 'Cardio Intenso',
      instructor: 'RogerBox',
      category: 'endurance',
      duration: '30 días',
      level: 'Avanzado',
      rating: 4.9,
      students: 2156,
      price: 59,
      thumbnail: '/images/curso-cardio.jpg',
      description: 'Entrenamientos cardiovasculares de alta intensidad para llevar tu resistencia al límite.',
      lessons: 30,
      isRecommended: userProfile?.goals?.includes('endurance') || false
    },
    {
      id: '5',
      title: 'Tonificación Total',
      instructor: 'RogerBox',
      category: 'tone',
      duration: '45 días',
      level: 'Intermedio',
      rating: 4.6,
      students: 1543,
      price: 69,
      thumbnail: '/images/curso-tonificacion.jpg',
      description: 'Define y tonifica tu cuerpo con ejercicios específicos para cada grupo muscular.',
      lessons: 45,
      isRecommended: userProfile?.goals?.includes('tone') || false
    },
    {
      id: '6',
      title: 'Ganancia Muscular',
      instructor: 'RogerBox',
      category: 'gain_muscle',
      duration: '75 días',
      level: 'Avanzado',
      rating: 4.8,
      students: 987,
      price: 99,
      thumbnail: '/images/curso-musculo.jpg',
      description: 'Maximiza tu crecimiento muscular con ejercicios de alta intensidad.',
      lessons: 75,
      isRecommended: userProfile?.goals?.includes('gain_muscle') || false
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedCourses = courses.filter(course => course.isRecommended);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/70">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/70">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                ROGER<span className="text-[#85ea10]">BOX</span>
              </h1>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/courses" className="text-gray-600 dark:text-white/70 hover:text-[#85ea10] transition-colors font-medium">
                Cursos
              </a>
              <a href="/about" className="text-gray-600 dark:text-white/70 hover:text-[#85ea10] transition-colors font-medium">
                Qué es RogerBox
              </a>
              <a href="/enterprises" className="text-gray-600 dark:text-white/70 hover:text-[#85ea10] transition-colors font-medium">
                Servicio para Empresas
              </a>
              <a href="/contact" className="text-gray-600 dark:text-white/70 hover:text-[#85ea10] transition-colors font-medium">
                Contacto
              </a>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-gray-700 dark:text-white hover:text-[#85ea10] transition-colors"
              >
                <div className="w-8 h-8 bg-[#85ea10] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{userProfile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-white/60">{userProfile.email}</p>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-white/20 py-1 z-50">
                  <a
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </a>
                  <button
                    onClick={() => {
                      // Handle logout
                      window.location.href = '/api/auth/signout';
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            ¡Hola, {userProfile.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-white/70">
            Listo para tu próxima sesión de entrenamiento
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#85ea10] focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#85ea10] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${
                  selectedCategory === category.id
                    ? 'bg-[#85ea10] text-black border-[#85ea10] shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-gray-200 dark:border-white/20 hover:border-[#85ea10]/50'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recomendados para Ti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map(course => (
                <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-[#85ea10]/20 to-[#85ea10]/40 flex items-center justify-center">
                      <Play className="w-12 h-12 text-[#85ea10]" />
                    </div>
                    <div className="absolute top-3 left-3 bg-[#85ea10] text-black px-3 py-1 rounded-full text-sm font-bold">
                      Recomendado
                    </div>
                    <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#85ea10] font-semibold">{course.level}</span>
                      <span className="text-sm text-gray-500 dark:text-white/60">{course.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-white/70 text-sm mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-white/60 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()} estudiantes</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${course.price}
                      </div>
                      <button
                        onClick={() => router.push(`/course/${course.id}`)}
                        className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Ver Curso</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Todos los Cursos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-[#85ea10]/20 to-[#85ea10]/40 flex items-center justify-center">
                    <Play className="w-12 h-12 text-[#85ea10]" />
                  </div>
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#85ea10] font-semibold">{course.level}</span>
                    <span className="text-sm text-gray-500 dark:text-white/60">{course.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-white/70 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-white/60 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()} estudiantes</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${course.price}
                    </div>
                    <button
                      onClick={() => router.push(`/course/${course.id}`)}
                      className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Ver Curso</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

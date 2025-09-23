'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Play, Clock, Users, Star, Filter, Search, User, LogOut, ChevronDown, ShoppingCart, Heart, BookOpen, Target, Zap, Utensils, ChefHat, Award, TrendingUp, Trophy, Weight, X, Info, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Footer from '@/components/Footer';
import QuickLoading from '@/components/QuickLoading';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  height: number;
  weight: number;
  gender: string;
  goals: string[];
  target_weight: number | null;
  goal_deadline: string | null;
  membership_status: string;
  current_weight?: number | null;
  weight_progress_percentage?: number | null;
  last_weight_update?: string | null;
  streak_days?: number | null;
  last_class_date?: string | null;
}

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
  // Campos adicionales para la UI
  instructor?: string;
  lessons?: number;
  isRecommended?: boolean;
  thumbnail?: string;
  duration?: string;
  students?: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [realCourses, setRealCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalData, setGoalData] = useState({
    targetWeight: '',
    goalType: 'lose', // 'lose', 'maintain', 'gain'
    deadline: ''
  });
  const [goalError, setGoalError] = useState('');
  const [goalLoading, setGoalLoading] = useState(false);
  const [showBMIModal, setShowBMIModal] = useState(false);

  // Obtener datos del perfil desde Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          console.log('Dashboard: Buscando perfil para ID:', session.user.id);
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
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

  // Cargar cursos reales
  useEffect(() => {
    loadCourses();
  }, [userProfile]); // Recargar cuando cambie el perfil del usuario

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
      const transformedCourses = (data || []).map(course => {
        // Mapear categorías de la base de datos a las categorías del usuario
        const categoryMap: { [key: string]: string } = {
          'Transformación Intensa': 'lose_weight',
          'HIIT Avanzado': 'hiit',
          'Cardio Intenso': 'endurance',
          'Fuerza Funcional': 'strength',
          'Entrenamiento en Casa': 'tone',
          'Rutina Matutina': 'lose_weight',
          'Sesión Nocturna': 'tone',
          'Entrenamiento Express': 'hiit',
          'Complementos': 'all'
        };
        
        const mappedCategory = categoryMap[course.category] || 'all';
        
        return {
          ...course,
          instructor: 'RogerBox',
          lessons: 1, // Por ahora, asumimos 1 lección por curso
          isRecommended: userProfile?.goals?.includes(mappedCategory) || false,
          thumbnail: course.preview_image,
          duration: `${course.duration_days} días`,
          students: course.students_count,
          category: mappedCategory // Usar la categoría mapeada para filtros
        };
      });
      
      setRealCourses(transformedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: '🎯' },
    { id: 'lose_weight', name: 'Bajar de Peso', icon: '🔥' },
    { id: 'tone', name: 'Tonificar', icon: '💪' },
    { id: 'gain_muscle', name: 'Ganar Músculo', icon: '🏋️' },
    { id: 'endurance', name: 'Resistencia', icon: '🏃' },
    { id: 'hiit', name: 'HIIT', icon: '⚡' },
    { id: 'strength', name: 'Fuerza', icon: '💪' }
  ];

  // Cursos de muestra (comentados para usar cursos reales)
  const sampleCourses: Course[] = [
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

  const filteredCourses = realCourses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedCourses = realCourses.filter(course => course.isRecommended);

  // Función para calcular IMC y dar recomendaciones
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMIRecommendation = (bmi: number) => {
    if (bmi < 18.5) {
      return {
        category: 'Bajo peso',
        message: 'Tu peso está por debajo del rango saludable. Te recomendamos ganar peso de forma saludable.',
        recommendation: 'Ganar peso',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        category: 'Peso normal',
        message: '¡Excelente! Tu peso está en el rango saludable. Mantén tu estilo de vida saludable.',
        recommendation: 'Mantener peso',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        category: 'Sobrepeso',
        message: 'Tienes sobrepeso. Te recomendamos bajar entre 5-10 kg para alcanzar un peso más saludable.',
        recommendation: 'Bajar peso',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    } else {
      return {
        category: 'Obesidad',
        message: 'Tienes obesidad. Te recomendamos bajar entre 10-20 kg para mejorar tu salud significativamente.',
        recommendation: 'Bajar peso',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const handleGoalSubmit = async () => {
    if (!goalData.targetWeight || !goalData.deadline) {
      setGoalError('Por favor completa todos los campos');
      return;
    }

    setGoalLoading(true);
    setGoalError('');

    try {
      console.log('Actualizando meta para usuario:', userProfile?.id);
      console.log('Datos de la meta:', goalData);

      // Verificar que tenemos el ID del usuario
      if (!userProfile?.id) {
        throw new Error('No se encontró el ID del usuario');
      }

      // Primero verificar si el perfil existe
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, target_weight, goal_deadline')
        .eq('id', userProfile.id)
        .single();

      if (fetchError) {
        console.error('Error obteniendo perfil:', fetchError);
        throw new Error('No se pudo obtener el perfil del usuario');
      }

      console.log('Perfil encontrado:', existingProfile);

      // Actualizar solo los campos de meta
      const { data, error } = await supabase
        .from('profiles')
        .update({
          target_weight: parseInt(goalData.targetWeight),
          goal_deadline: goalData.deadline,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id)
        .select();

      if (error) {
        console.error('Error de Supabase al actualizar:', error);
        console.error('Detalles del error:', JSON.stringify(error, null, 2));
        throw new Error(`Error al actualizar la meta: ${error.message || 'Error desconocido'}`);
      }

      console.log('Meta actualizada exitosamente:', data);

      // Actualizar el perfil local
      setUserProfile(prev => prev ? {
        ...prev,
        target_weight: parseInt(goalData.targetWeight),
        goal_deadline: goalData.deadline
      } : null);

      setShowGoalModal(false);
      setGoalData({ targetWeight: '', goalType: 'lose', deadline: '' });
      
      // Recargar la página para reflejar los cambios
      window.location.reload();
    } catch (error: any) {
      console.error('Error actualizando meta:', error);
      setGoalError(error.message || 'Error al actualizar la meta. Inténtalo de nuevo.');
    } finally {
      setGoalLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <QuickLoading message="Cargando tu dashboard..." duration={2000} />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (!userProfile) {
    return <QuickLoading message="Cargando tu perfil..." duration={1500} />;
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
                  {session?.user?.id === 'cdeaf7e0-c7fa-40a9-b6e9-288c9a677b5e' && (
                    <button
                      onClick={() => router.push('/admin')}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                  <button
                    onClick={() => router.push('/signout')}
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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            ¡Hola, {userProfile.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-white/70">
            Listo para tu próxima sesión de entrenamiento
          </p>
        </div>

        {/* Progress Tracking Section */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-5 h-5 text-[#85ea10]" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tu Progreso</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Racha de Clases */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-4 h-4 text-[#85ea10]" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Racha Actual</h3>
                </div>
                <div className="text-3xl font-bold text-[#85ea10] mb-1">
                  {userProfile.streak_days || 0} días
                </div>
                <div className="text-sm text-gray-600 dark:text-white/60">Clases consecutivas</div>
                <div className="mt-2 text-xs text-gray-500 dark:text-white/40">
                  {userProfile.streak_days && userProfile.streak_days > 0 ? 
                    `Última clase: ${userProfile.last_class_date ? new Date(userProfile.last_class_date).toLocaleDateString('es-ES') : 'Ayer'}` :
                    '¡Comienza tu primera clase!'
                  }
                </div>
              </div>

              {/* Meta de Peso */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Weight className="w-4 h-4 text-[#85ea10]" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Meta de Peso</h3>
                </div>
                
                {userProfile.target_weight ? (
                  <>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {userProfile.current_weight || userProfile.weight} → {userProfile.target_weight} kg
                    </div>
                    <div className="text-sm text-gray-600 dark:text-white/60 mb-2">
                      Progreso: {userProfile.weight_progress_percentage || 0}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/20 rounded-full h-2">
                      <div className="bg-[#85ea10] h-2 rounded-full" style={{
                        width: `${userProfile.weight_progress_percentage || 0}%`
                      }}></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-white/40">
                      Fecha límite: {userProfile.goal_deadline ? 
                        new Date(userProfile.goal_deadline).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : 
                        'No definida'
                      }
                    </div>
                    <div className="mt-3">
                      <button 
                        onClick={() => {
                          setGoalData({
                            targetWeight: userProfile.target_weight?.toString() || '',
                            goalType: 'lose',
                            deadline: userProfile.goal_deadline || ''
                          });
                          setShowGoalModal(true);
                        }}
                        className="text-[#85ea10] hover:text-[#7dd30f] text-xs font-medium transition-colors"
                      >
                        Actualizar Meta
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center pt-0 pb-2">
                    <div className="text-sm text-gray-700 dark:text-white/80 mb-2">
                      ¡Establece tu objetivo y comienza a transformarte!
                    </div>
                    <button 
                      onClick={() => setShowGoalModal(true)}
                      className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-medium px-3 py-1.5 rounded-lg transition-colors text-sm"
                    >
                      Crear mi meta
                    </button>
                  </div>
                )}
              </div>

              {/* Recomendación de Curso */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Play className="w-4 h-4 text-[#85ea10]" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recomendación</h3>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  "Transformación Total 90 Días"
                </div>
                <div className="text-xs text-gray-600 dark:text-white/60 mb-2">
                  Perfecto para tu meta de bajar 10kg
                </div>
                <div className="text-xs text-[#85ea10] font-medium">
                  Podrías lograrlo en 3 meses
                </div>
              </div>
            </div>

            {/* Agregar Meta - Solo mostrar si no hay meta establecida */}
            {!userProfile.target_weight && (
              <div className="mt-6 bg-gradient-to-r from-[#85ea10]/10 to-[#85ea10]/5 rounded-xl p-4 border border-[#85ea10]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">¡Establece tu Meta!</h3>
                    <p className="text-sm text-gray-600 dark:text-white/60">
                      Peso actual: {userProfile.weight} kg - ¿Cuál es tu objetivo?
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowGoalModal(true)}
                    className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Agregar Meta
                  </button>
                </div>
              </div>
            )}
          </div>
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
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map(course => (
                <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                      <img 
                        src={course.thumbnail || '/images/course-placeholder.jpg'} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden absolute inset-0 bg-gradient-to-br from-[#85ea10]/20 to-[#85ea10]/40 flex items-center justify-center">
                        <Play className="w-12 h-12 text-[#85ea10]" />
                      </div>
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
          {loadingCourses ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Cargando cursos...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Estamos preparando los mejores cursos para ti
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay cursos disponibles
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pronto tendremos nuevos cursos para ti
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                    <img 
                      src={course.thumbnail || '/images/course-placeholder.jpg'} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-[#85ea10]/20 to-[#85ea10]/40 flex items-center justify-center">
                      <Play className="w-12 h-12 text-[#85ea10]" />
                    </div>
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
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal para establecer meta */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Establece tu Meta
              </h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Análisis de IMC */}
            {userProfile && (
              <div className={`mb-6 p-4 rounded-xl border ${getBMIRecommendation(calculateBMI(userProfile.weight, userProfile.height)).bgColor} ${getBMIRecommendation(calculateBMI(userProfile.weight, userProfile.height)).borderColor}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Target className={`w-5 h-5 ${getBMIRecommendation(calculateBMI(userProfile.weight, userProfile.height)).color}`} />
                  <h3 className={`font-semibold ${getBMIRecommendation(calculateBMI(userProfile.weight, userProfile.height)).color}`}>
                    {getBMIRecommendation(calculateBMI(userProfile.weight, userProfile.height)).category}
                  </h3>
                </div>
                <p className={`text-sm ${getBMIRecommendation(calculateBMI(userProfile.weight, userProfile.height)).color}`}>
                  {getBMIRecommendation(calculateBMI(userProfile.weight, userProfile.height)).message}
                </p>
                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  <span>IMC: {calculateBMI(userProfile.weight, userProfile.height).toFixed(1)}</span>
                  <button
                    onClick={() => setShowBMIModal(true)}
                    className="bg-[#85ea10] hover:bg-[#7dd30f] text-white rounded-full p-1 transition-all duration-200 hover:scale-110 shadow-sm"
                    title="Saber más sobre el IMC"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Formulario */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Peso Objetivo (kg)
                </label>
                <input
                  type="number"
                  value={goalData.targetWeight}
                  onChange={(e) => setGoalData(prev => ({ ...prev, targetWeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Ej: 65"
                  min="30"
                  max="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha Límite
                </label>
                <input
                  type="date"
                  value={goalData.deadline}
                  onChange={(e) => setGoalData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {goalError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{goalError}</p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowGoalModal(false)}
                disabled={goalLoading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleGoalSubmit}
                disabled={goalLoading || !goalData.targetWeight || !goalData.deadline}
                className="flex-1 px-4 py-2 bg-[#85ea10] hover:bg-[#7dd30f] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {goalLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Estableciendo...
                  </>
                ) : (
                  'Establecer Meta'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de información del IMC */}
      {showBMIModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ¿Qué es el IMC?
              </h2>
              <button
                onClick={() => setShowBMIModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">¿Qué significa?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  El <strong>Índice de Masa Corporal (IMC)</strong> es una medida que relaciona tu peso con tu altura para evaluar si tienes un peso saludable.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fórmula:</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <code className="text-sm text-gray-800 dark:text-gray-200">
                    IMC = Peso (kg) ÷ Altura (m)²
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Clasificación:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Bajo peso:</span>
                    <span className="text-blue-600 font-medium">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Peso normal:</span>
                    <span className="text-green-600 font-medium">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sobrepeso:</span>
                    <span className="text-orange-600 font-medium">25.0 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Obesidad I:</span>
                    <span className="text-red-600 font-medium">30.0 - 34.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Obesidad II:</span>
                    <span className="text-red-700 font-medium">35.0 - 39.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Obesidad III:</span>
                    <span className="text-red-800 font-medium">≥ 40.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tu IMC actual:</strong> {calculateBMI(userProfile.weight, userProfile.height).toFixed(1)} 
                  <br />
                  <strong>Clasificación:</strong> {getBMIRecommendation(calculateBMI(userProfile.weight, userProfile.height)).category}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> El IMC es una guía general. Consulta con un profesional de la salud para una evaluación completa.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowBMIModal(false)}
                className="w-full px-4 py-2 bg-[#85ea10] hover:bg-[#7dd30f] text-black font-semibold rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

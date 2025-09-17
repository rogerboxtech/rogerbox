'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Users, Star, Filter, Search, ArrowRight, Trophy, Target, Zap, Utensils, BookOpen, ChefHat } from 'lucide-react';

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

interface CourseDashboardProps {
  userProfile: {
    height: number;
    gender: string;
    weight: number;
    goals: string[];
  };
}

export default function CourseDashboard({ userProfile }: CourseDashboardProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Todos', icon: '🎯' },
    { id: 'lose_weight', name: 'Bajar de Peso', icon: '🔥' },
    { id: 'tone', name: 'Tonificar', icon: '💪' },
    { id: 'gain_muscle', name: 'Ganar Músculo', icon: '🏋️' },
    { id: 'endurance', name: 'Resistencia', icon: '🏃' },
    { id: 'flexibility', name: 'Flexibilidad', icon: '🧘' },
    { id: 'strength', name: 'Fuerza', icon: '⚡' }
  ];

  const courses: Course[] = [
    {
      id: '1',
      title: 'HIIT para Principiantes - Bajar de Peso',
      instructor: 'Roger Barreto',
      category: 'lose_weight',
      duration: '4 semanas',
      level: 'Principiante',
      rating: 4.9,
      students: 1250,
      price: 7900,
      thumbnail: '/api/placeholder/300/200',
      description: 'Rutina HIIT diseñada específicamente para quemar grasa y bajar de peso de forma efectiva.',
      lessons: 12,
      isRecommended: userProfile.goals.includes('lose_weight')
    },
    {
      id: '2',
      title: 'Tonificación Total - 30 Días',
      instructor: 'Roger Barreto',
      category: 'tone',
      duration: '6 semanas',
      level: 'Intermedio',
      rating: 4.8,
      students: 980,
      price: 7900,
      thumbnail: '/api/placeholder/300/200',
      description: 'Programa completo de tonificación que define y fortalece todos los grupos musculares.',
      lessons: 18,
      isRecommended: userProfile.goals.includes('tone')
    },
    {
      id: '3',
      title: 'Plan de Pesas - 120kg',
      instructor: 'Roger Barreto',
      category: 'gain_muscle',
      duration: '8 semanas',
      level: 'Avanzado',
      rating: 4.9,
      students: 750,
      price: 7900,
      thumbnail: '/api/placeholder/300/200',
      description: 'Programa intensivo de musculación para ganar masa muscular y fuerza.',
      lessons: 24,
      isRecommended: userProfile.goals.includes('gain_muscle')
    },
    {
      id: '4',
      title: 'Resistencia Cardio - Maratón',
      instructor: 'Roger Barreto',
      category: 'endurance',
      duration: '10 semanas',
      level: 'Intermedio',
      rating: 4.7,
      students: 650,
      price: 7900,
      thumbnail: '/api/placeholder/300/200',
      description: 'Entrenamiento de resistencia para mejorar tu capacidad cardiovascular.',
      lessons: 20,
      isRecommended: userProfile.goals.includes('endurance')
    },
    {
      id: '5',
      title: 'Flexibilidad y Movilidad',
      instructor: 'Roger Barreto',
      category: 'flexibility',
      duration: '4 semanas',
      level: 'Principiante',
      rating: 4.6,
      students: 420,
      price: 7900,
      thumbnail: '/api/placeholder/300/200',
      description: 'Mejora tu flexibilidad y movilidad con ejercicios específicos.',
      lessons: 14,
      isRecommended: userProfile.goals.includes('flexibility')
    },
    {
      id: '6',
      title: 'Fuerza Funcional',
      instructor: 'Roger Barreto',
      category: 'strength',
      duration: '6 semanas',
      level: 'Avanzado',
      rating: 4.8,
      students: 580,
      price: 7900,
      thumbnail: '/api/placeholder/300/200',
      description: 'Desarrolla fuerza funcional para actividades diarias.',
      lessons: 16,
      isRecommended: userProfile.goals.includes('strength')
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedCourses = courses.filter(course => course.isRecommended);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#164151]/80 via-[#29839c]/70 to-[#164151]/60 backdrop-blur-sm z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-transparent border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-white">
                  ROGER<span className="text-[#85ea10]">BOX</span>
                </h1>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center space-x-4">
                <div className="text-right text-white">
                  <div className="font-semibold">Bienvenido de vuelta</div>
                  <div className="text-sm text-white/60">Listo para entrenar</div>
                </div>
                <div className="w-10 h-10 bg-[#85ea10] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold">U</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">
              Tus Cursos Recomendados
            </h2>
            <p className="text-white/80">
              Basado en tus objetivos: {userProfile.goals.map(goal => 
                categories.find(cat => cat.id === goal)?.name
              ).join(', ')}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10]"
              />
            </div>
            <button className="px-6 py-3 bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold rounded-xl transition-colors flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtrar</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-[#85ea10] bg-[#85ea10]/10 text-[#85ea10]'
                    : 'border-white/30 text-white hover:border-white/50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Recommended Courses */}
          {recommendedCourses.length > 0 && selectedCategory === 'all' && (
            <div className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <Trophy className="w-6 h-6 text-[#85ea10]" />
                <h3 className="text-2xl font-bold text-white">Recomendados para ti</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* All Courses */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              {selectedCategory === 'all' ? 'Todos los Cursos' : 
               categories.find(cat => cat.id === selectedCategory)?.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* Nutritional Plans Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <ChefHat className="w-8 h-8 text-[#85ea10]" />
                <h2 className="text-3xl font-black text-white">Planes Nutricionales</h2>
              </div>
              <button
                onClick={() => router.push('/nutritional-plans')}
                className="flex items-center text-[#85ea10] hover:text-white transition-colors"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <p className="text-white/80 mb-8 max-w-2xl">
              Complementa tu entrenamiento con planes nutricionales diseñados por Roger Barreto
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Nutritional Plans */}
              <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10] transition-all duration-300 group">
                <div className="relative h-48 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-white/80" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#85ea10]/20 text-[#85ea10] rounded-full text-sm font-medium">
                      Bajar de Peso
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Plan Definitivo para Bajar de Peso</h3>
                  <p className="text-white/70 mb-4">Plan nutricional de 30 días diseñado para pérdida de peso saludable</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-[#85ea10]">$89,000</div>
                    <button className="bg-[#85ea10] hover:bg-[#7dd30f] text-black px-4 py-2 rounded-lg font-bold transition-colors">
                      Ver Plan
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10] transition-all duration-300 group">
                <div className="relative h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <ChefHat className="w-16 h-16 text-white/80" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#85ea10]/20 text-[#85ea10] rounded-full text-sm font-medium">
                      Ganar Músculo
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Plan de Ganancia Muscular</h3>
                  <p className="text-white/70 mb-4">Plan nutricional de 21 días para ganar masa muscular</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-[#85ea10]">$79,000</div>
                    <button className="bg-[#85ea10] hover:bg-[#7dd30f] text-black px-4 py-2 rounded-lg font-bold transition-colors">
                      Ver Plan
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10] transition-all duration-300 group">
                <div className="relative h-48 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-white/80" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#85ea10]/20 text-[#85ea10] rounded-full text-sm font-medium">
                      Detox
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Plan Detox de 7 Días</h3>
                  <p className="text-white/70 mb-4">Plan de desintoxicación para limpiar el organismo</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-[#85ea10]">$49,000</div>
                    <button className="bg-[#85ea10] hover:bg-[#7dd30f] text-black px-4 py-2 rounded-lg font-bold transition-colors">
                      Ver Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutritional Blogs Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-[#85ea10]" />
                <h2 className="text-3xl font-black text-white">Blog Nutricional</h2>
              </div>
              <button
                onClick={() => router.push('/nutritional-blogs')}
                className="flex items-center text-[#85ea10] hover:text-white transition-colors"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <p className="text-white/80 mb-8 max-w-2xl">
              Consejos, tips y guías gratuitas para optimizar tu alimentación
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sample Blog Posts */}
              <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10] transition-all duration-300 group">
                <div className="h-32 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/80" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">10 Alimentos que Aceleran tu Metabolismo</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">Descubre los alimentos que te ayudan a quemar más calorías</p>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>5 min lectura</span>
                    <span className="text-[#85ea10] font-bold">GRATIS</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10] transition-all duration-300 group">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/80" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">Cómo Hidratarte Correctamente</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">La hidratación es clave para un rendimiento óptimo</p>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>4 min lectura</span>
                    <span className="text-[#85ea10] font-bold">GRATIS</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10] transition-all duration-300 group">
                <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/80" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">Proteínas: Todo lo que Necesitas Saber</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">Guía completa sobre proteínas para maximizar resultados</p>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>7 min lectura</span>
                    <span className="text-[#85ea10] font-bold">GRATIS</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10] transition-all duration-300 group">
                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/80" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">Meal Prep: Prepárate para el Éxito</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">Aprende a preparar tus comidas de la semana</p>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>6 min lectura</span>
                    <span className="text-[#85ea10] font-bold">GRATIS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/20 hover:border-[#85ea10] transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-[#164151] to-[#29839c] flex items-center justify-center">
          <Play className="w-16 h-16 text-white/60" />
        </div>
        {course.isRecommended && (
          <div className="absolute top-4 left-4 bg-[#85ea10] text-black px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>Recomendado</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full font-bold text-sm">
          ${course.price.toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#85ea10] text-sm font-semibold">{course.level}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm">{course.rating}</span>
          </div>
        </div>

        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#85ea10] transition-colors">
          {course.title}
        </h4>

        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-white/60 text-sm mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
          </div>
          <span>{course.lessons} clases</span>
        </div>

        <button 
          onClick={() => window.location.href = `/course/${course.id}`}
          className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
        >
          <span>Ver Curso</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

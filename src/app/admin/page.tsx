'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  ShoppingCart, 
  Building2, 
  BarChart3, 
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  X,
  CheckCircle,
  Search
} from 'lucide-react';
import QuickLoading from '@/components/QuickLoading';
import CourseCreator from '@/components/admin/CourseCreator';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { supabase } from '@/lib/supabase';

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalSales: number;
  totalRevenue: number;
  activeCourses: number;
  enterpriseLicenses: number;
}

interface Course {
  id: string;
  title: string;
  short_description: string;
  description?: string;
  preview_image?: string;
  price: number;
  discount_percentage: number;
  category: string;
  duration_days: number;
  students_count: number;
  rating: number;
  calories_burned: number;
  intro_video_url?: string;
  level: string;
  is_published: boolean;
  created_at: string;
  // include_iva: boolean; // Temporalmente deshabilitado
  // iva_percentage: number; // Temporalmente deshabilitado
  course_lessons?: Array<{
    id: string;
    title: string;
    description: string;
    video_url: string;
    preview_image: string;
    lesson_order: number;
    duration_minutes: number;
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCourseCreator, setShowCourseCreator] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => {},
    isLoading: false
  });

  // Verificar si es admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && (session?.user as any)?.id !== 'cdeaf7e0-c7fa-40a9-b6e9-288c9a677b5e') {
      router.push('/dashboard');
      return;
    }

    if (status === 'authenticated') {
      loadAdminData();
    }
  }, [status, session, router]);

  // Cargar datos cuando se cambie de pestaña
  useEffect(() => {
    if (activeTab === 'courses') {
      loadCourses();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      // Simular datos por ahora
      setStats({
        totalUsers: 150,
        totalCourses: 8,
        totalSales: 45,
        totalRevenue: 4500,
        activeCourses: 6,
        enterpriseLicenses: 2
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      console.log('Cargando cursos...');
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_lessons (
            id,
            title,
            description,
            video_url,
            preview_image,
            lesson_number,
            lesson_order,
            duration_minutes
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }
      
      console.log('Cursos cargados:', data);
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      // Mostrar error en la UI
      alert('Error al cargar los cursos. Revisa la consola para más detalles.');
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      console.log('Cargando usuarios...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }
      
      console.log('Usuarios cargados:', data);
      if (data && data.length > 0) {
        console.log('Columnas disponibles en el primer usuario:', Object.keys(data[0]));
      }
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error al cargar los usuarios. Revisa la consola para más detalles.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleCoursePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;
      
      // Actualizar la lista de cursos
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, is_published: !currentStatus }
          : course
      ));
    } catch (error) {
      console.error('Error updating course status:', error);
      alert('Error al actualizar el estado del curso');
    }
  };

  const editCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    console.log('🔍 Admin - editCourse llamado para courseId:', courseId);
    console.log('🔍 Admin - course encontrado:', course);
    console.log('🔍 Admin - lessons en course:', course?.course_lessons);
    
    if (course) {
      // Mapear course_lessons a lessons para el CourseCreator
      const courseWithLessons = {
        ...course,
        lessons: course.course_lessons || []
      };
      console.log('🔍 Admin - courseWithLessons mapeado:', courseWithLessons);
      
      setEditingCourse(courseWithLessons);
      setShowCourseCreator(true);
    }
  };

  const deleteCourse = (courseId: string, courseTitle: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Curso',
      message: `¿Estás seguro de que quieres eliminar el curso "${courseTitle}"? Esta acción no se puede deshacer y eliminará todas las lecciones asociadas.`,
      type: 'danger',
      onConfirm: () => handleDeleteCourse(courseId, courseTitle),
      isLoading: false
    });
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    try {
      setConfirmDialog(prev => ({ ...prev, isLoading: true }));

      // Primero eliminar las lecciones del curso
      const { error: lessonsError } = await supabase
        .from('course_lessons')
        .delete()
        .eq('course_id', courseId);

      if (lessonsError) throw lessonsError;

      // Luego eliminar el curso
      const { error: courseError } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (courseError) throw courseError;
      
      // Actualizar la lista de cursos
      setCourses(prev => prev.filter(course => course.id !== courseId));
      
      // Cerrar diálogo y mostrar éxito
      setConfirmDialog({
        isOpen: false,
        title: '',
        message: '',
        type: 'danger',
        onConfirm: () => {},
        isLoading: false
      });

      // Mostrar diálogo de éxito
      setConfirmDialog({
        isOpen: true,
        title: 'Curso Eliminado',
        message: `El curso "${courseTitle}" ha sido eliminado exitosamente.`,
        type: 'success',
        onConfirm: () => setConfirmDialog(prev => ({ ...prev, isOpen: false })),
        isLoading: false
      });

    } catch (error) {
      console.error('Error deleting course:', error);
      setConfirmDialog(prev => ({ ...prev, isLoading: false }));
      
      // Mostrar error
      setConfirmDialog({
        isOpen: true,
        title: 'Error',
        message: 'Error al eliminar el curso. Por favor, inténtalo de nuevo.',
        type: 'danger',
        onConfirm: () => setConfirmDialog(prev => ({ ...prev, isOpen: false })),
        isLoading: false
      });
    }
  };

  if (status === 'loading' || loading) {
    return <QuickLoading message="Cargando panel de administración..." duration={1000} />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if ((session?.user as any)?.id !== 'cdeaf7e0-c7fa-40a9-b6e9-288c9a677b5e') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'courses', label: 'Cursos', icon: BookOpen },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart },
    { id: 'enterprise', label: 'Empresas', icon: Building2 },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl text-gray-900 dark:text-white">
                <span className="font-black">ROGER<span className="text-[#85ea10]">BOX</span></span> Admin
              </h1>
              <span className="bg-[#85ea10] text-black px-2 py-1 rounded-full text-xs font-semibold">
                Super Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-white/70">
                {session?.user?.name || 'Admin'}
              </span>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Ver Dashboard Usuario
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#85ea10] text-[#85ea10]'
                      : 'border-transparent text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white/80 hover:border-gray-300 dark:hover:border-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-white/60">Total Usuarios</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-white/60">Cursos Activos</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeCourses || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-white/60">Total Ventas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalSales || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-white/60">Ingresos</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${stats?.totalRevenue?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Crear Curso</h3>
                    <p className="text-sm text-gray-600 dark:text-white/60">Añadir nuevo curso a la plataforma</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingCourse(null);
                      setShowCourseCreator(true);
                    }}
                    className="bg-[#85ea10] hover:bg-[#7dd30f] text-black p-3 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ver Usuarios</h3>
                    <p className="text-sm text-gray-600 dark:text-white/60">Gestionar usuarios registrados</p>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors">
                    <Users className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Configuración</h3>
                    <p className="text-sm text-gray-600 dark:text-white/60">Ajustes de la plataforma</p>
                  </div>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gestión de Cursos</h2>
              <button 
                onClick={() => {
                  setEditingCourse(null);
                  setShowCourseCreator(true);
                }}
                className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Curso</span>
              </button>
            </div>

            {loadingCourses ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-center text-gray-500 dark:text-white/60 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#85ea10] mx-auto mb-4"></div>
                  <p>Cargando cursos...</p>
                </div>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="text-center text-gray-500 dark:text-white/60 py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-white/30" />
                  <p>No hay cursos creados</p>
                  <p className="text-sm mt-2">Crea tu primer curso para comenzar</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.is_published 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {course.is_published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.short_description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Precio:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${course.price?.toLocaleString('es-CO')} COP
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Duración:</span>
                        <span className="text-gray-900 dark:text-white">{course.duration_days} días</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Nivel:</span>
                        <span className="text-gray-900 dark:text-white capitalize">{course.level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Estudiantes:</span>
                        <span className="text-gray-900 dark:text-white">{course.students_count}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => editCourse(course.id)}
                        className="flex-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button 
                        onClick={() => deleteCourse(course.id, course.title)}
                        className="flex-1 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                      <button 
                        onClick={() => toggleCoursePublish(course.id, course.is_published)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1 ${
                          course.is_published
                            ? 'bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300'
                            : 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-700 dark:text-green-300'
                        }`}
                      >
                        {course.is_published ? (
                          <>
                            <X className="w-4 h-4" />
                            <span>Despublicar</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Publicar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gestión de Usuarios</h2>
              <button className="bg-[#85ea10] hover:bg-[#7dd30f] text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Crear Usuario</span>
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre o email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#85ea10] focus:border-transparent"
                />
              </div>
            </div>

            {/* Lista de usuarios */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#85ea10] mx-auto"></div>
                  <p className="text-gray-500 dark:text-white/60 mt-2">Cargando usuarios...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-white/60 py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-white/30" />
                  <p>No hay usuarios registrados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Meta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Peso Actual
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha Registro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users
                        .filter(user => 
                          user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
                        )
                        .map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-[#85ea10] flex items-center justify-center">
                                  <span className="text-black font-semibold text-sm">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name || 'Sin nombre'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {user.id.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.goals || user.goal || 'No especificada'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user.current_weight ? `${user.current_weight} kg` : 'No especificado'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(user.created_at).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.subscription_status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {user.subscription_status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gestión de Ventas</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-center text-gray-500 dark:text-white/60 py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-white/30" />
                <p>Panel de ventas en desarrollo</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'enterprise' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gestión de Empresas</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-center text-gray-500 dark:text-white/60 py-8">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-white/30" />
                <p>Panel de empresas en desarrollo</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Configuración</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-center text-gray-500 dark:text-white/60 py-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-white/30" />
                <p>Panel de configuración en desarrollo</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Creator Modal */}
      {showCourseCreator && (
        <CourseCreator
          onClose={() => {
            setShowCourseCreator(false);
            setEditingCourse(null);
          }}
          onSuccess={() => {
            setShowCourseCreator(false);
            setEditingCourse(null);
            // Recargar datos si es necesario
            loadAdminData();
            loadCourses();
          }}
          courseToEdit={editingCourse}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.type === 'danger' ? 'Eliminar' : 'Confirmar'}
        cancelText="Cancelar"
        isLoading={confirmDialog.isLoading}
      />
    </div>
  );
}
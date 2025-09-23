'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Clock, 
  Users, 
  Star, 
  Flame,
  Play,
  Image as ImageIcon,
  Video,
  Calendar,
  DollarSign,
  Tag,
  Target,
  Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CategoryManager from './CategoryManager';

interface CourseData {
  title: string;
  description: string;
  short_description: string;
  preview_image: string | null;
  price: number | null;
  discount_percentage: number | null;
  category: string;
  duration_days: number | null;
  students_count: number | null;
  rating: number | null;
  calories_burned: number | null;
  intro_video_url: string;
  level: string;
  is_published: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
}

interface LessonData {
  id?: string;
  title: string;
  description: string;
  preview_image: string | null;
  video_url: string;
  lesson_number: number;
  lesson_order: number;
  duration_minutes: number;
  is_preview: boolean;
}

interface CourseCreatorProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CourseCreator({ onClose, onSuccess }: CourseCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    short_description: '',
    preview_image: null,
    price: null,
    discount_percentage: null,
    category: '',
    duration_days: null,
    students_count: null,
    rating: null,
    calories_burned: null,
    intro_video_url: '',
    level: 'beginner',
    is_published: true
  });
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
      
      // Si hay categorías y no hay una seleccionada, seleccionar la primera
      if (data && data.length > 0 && !courseData.category) {
        setCourseData(prev => ({ ...prev, category: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'course' | 'lesson', lessonIndex?: number) => {
    try {
      // Por ahora, convertimos la imagen a base64 para almacenamiento temporal
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        
        if (type === 'course') {
          setCourseData(prev => ({ ...prev, preview_image: base64String }));
        } else if (type === 'lesson' && lessonIndex !== undefined) {
          const updatedLessons = [...lessons];
          updatedLessons[lessonIndex].preview_image = base64String;
          setLessons(updatedLessons);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error al procesar la imagen. Inténtalo de nuevo.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'course' | 'lesson', lessonIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0], type, lessonIndex);
    }
  };

  const addLesson = () => {
    const newLesson: LessonData = {
      title: '',
      description: '',
      preview_image: null,
      video_url: '',
      lesson_number: lessons.length + 1,
      lesson_order: lessons.length + 1,
      duration_minutes: 30,
      is_preview: false
    };
    setLessons([...lessons, newLesson]);
  };

  const removeLesson = (index: number) => {
    const updatedLessons = lessons.filter((_, i) => i !== index);
    // Reordenar las lecciones
    updatedLessons.forEach((lesson, i) => {
      lesson.lesson_number = i + 1;
      lesson.lesson_order = i + 1;
    });
    setLessons(updatedLessons);
  };

  const updateLesson = (index: number, field: keyof LessonData, value: any) => {
    const updatedLessons = [...lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setLessons(updatedLessons);
  };

  // Función para validar si el formulario está completo
  const isFormValid = () => {
    return (
      courseData.title.trim() &&
      courseData.title.length <= 100 &&
      courseData.description.trim() &&
      courseData.description.length <= 1000 &&
      courseData.short_description.trim() &&
      courseData.short_description.length <= 200 &&
      courseData.price && courseData.price > 0 &&
      courseData.category &&
      courseData.duration_days && courseData.duration_days > 0 &&
      courseData.level &&
      lessons.length > 0 &&
      lessons.every(lesson => 
        lesson.title.trim() &&
        lesson.title.length <= 100 &&
        lesson.description.trim() &&
        lesson.description.length <= 300 &&
        lesson.video_url.trim() &&
        lesson.duration_minutes && lesson.duration_minutes > 0
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validaciones obligatorias
      if (!courseData.title.trim()) {
        alert('El nombre del curso es obligatorio');
        return;
      }
      
      if (courseData.title.length > 100) {
        alert('El nombre del curso no puede exceder 100 caracteres');
        return;
      }
      
      if (!courseData.description.trim()) {
        alert('La descripción del curso es obligatoria');
        return;
      }
      
      if (courseData.description.length > 1000) {
        alert('La descripción del curso no puede exceder 1000 caracteres');
        return;
      }
      
      if (!courseData.short_description.trim()) {
        alert('La descripción corta es obligatoria');
        return;
      }
      
      if (courseData.short_description.length > 200) {
        alert('La descripción corta no puede exceder 200 caracteres');
        return;
      }
      
      if (!courseData.price || courseData.price <= 0) {
        alert('El precio debe ser mayor a 0');
        return;
      }
      
      if (!courseData.category) {
        alert('Debes seleccionar una categoría');
        return;
      }
      
      if (!courseData.duration_days || courseData.duration_days <= 0) {
        alert('La duración debe ser mayor a 0 días');
        return;
      }
      
      if (!courseData.level) {
        alert('Debes seleccionar un nivel');
        return;
      }
      
      if (lessons.length === 0) {
        alert('Debes agregar al menos una lección');
        return;
      }

      // Validar que todas las lecciones tengan datos obligatorios
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        if (!lesson.title.trim()) {
          alert(`La lección ${i + 1} debe tener un título`);
          return;
        }
        if (lesson.title.length > 100) {
          alert(`El título de la lección ${i + 1} no puede exceder 100 caracteres`);
          return;
        }
        if (!lesson.description.trim()) {
          alert(`La lección ${i + 1} debe tener una descripción`);
          return;
        }
        if (lesson.description.length > 300) {
          alert(`La descripción de la lección ${i + 1} no puede exceder 300 caracteres`);
          return;
        }
        if (!lesson.video_url.trim()) {
          alert(`La lección ${i + 1} debe tener una URL de video`);
          return;
        }
        if (!lesson.duration_minutes || lesson.duration_minutes <= 0) {
          alert(`La lección ${i + 1} debe tener una duración válida`);
          return;
        }
      }

      // Preparar datos del curso convirtiendo null a 0
      const courseDataToSubmit = {
        ...courseData,
        price: courseData.price || 0,
        discount_percentage: courseData.discount_percentage || 0,
        duration_days: courseData.duration_days || 30,
        students_count: courseData.students_count || 0,
        rating: courseData.rating || 0,
        calories_burned: courseData.calories_burned || 0
      };

      console.log('Creando curso con datos:', courseDataToSubmit);
      console.log('Lecciones:', lessons);

      // Crear el curso
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert([courseDataToSubmit])
        .select()
        .single();

      if (courseError) {
        console.error('Error creando curso:', courseError);
        throw new Error(`Error al crear el curso: ${courseError.message}`);
      }

      console.log('Curso creado exitosamente:', course);

      // Crear las lecciones
      if (lessons.length > 0) {
        const lessonsWithCourseId = lessons.map(lesson => ({
          ...lesson,
          course_id: course.id
        }));

        console.log('Creando lecciones:', lessonsWithCourseId);

        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(lessonsWithCourseId);

        if (lessonsError) {
          console.error('Error creando lecciones:', lessonsError);
          throw new Error(`Error al crear las lecciones: ${lessonsError.message}`);
        }

        console.log('Lecciones creadas exitosamente');
      }

      alert('¡Curso creado exitosamente!');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating course:', error);
      alert(`Error al crear el curso: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Información Básica', icon: Target },
    { number: 2, title: 'Detalles del Curso', icon: DollarSign },
    { number: 3, title: 'Lecciones', icon: Play },
    { number: 4, title: 'Revisar y Crear', icon: Eye }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear Nuevo Curso
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive || isCompleted
                      ? 'bg-[#85ea10] border-[#85ea10] text-black'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-[#85ea10]' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-[#85ea10]' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Información Básica
              </h3>
              
              {/* Título del curso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Curso * ({courseData.title.length}/100)
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                    courseData.title.length > 100 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ej: Transformación Total 90 Días (máx. 100 caracteres)"
                  maxLength={100}
                />
                {courseData.title.length > 100 && (
                  <p className="text-red-500 text-sm mt-1">El nombre del curso no puede exceder 100 caracteres</p>
                )}
              </div>

              {/* Descripción corta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción Corta * ({courseData.short_description.length}/200)
                </label>
                <input
                  type="text"
                  value={courseData.short_description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, short_description: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                    courseData.short_description.length > 200 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Una descripción breve del curso (máx. 200 caracteres)"
                  maxLength={200}
                />
                {courseData.short_description.length > 200 && (
                  <p className="text-red-500 text-sm mt-1">La descripción corta no puede exceder 200 caracteres</p>
                )}
              </div>

              {/* Descripción completa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción Completa * ({courseData.description.length}/1000)
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                    courseData.description.length > 1000 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Describe detalladamente qué incluye el curso, objetivos, metodología, etc. (máx. 1000 caracteres)"
                  maxLength={1000}
                />
                {courseData.description.length > 1000 && (
                  <p className="text-red-500 text-sm mt-1">La descripción completa no puede exceder 1000 caracteres</p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categoría *
                  </label>
                  <button
                    onClick={() => setShowCategoryManager(true)}
                    className="text-[#85ea10] hover:text-[#7dd30f] text-sm font-medium flex items-center space-x-1 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Gestionar</span>
                  </button>
                </div>
                
                {loadingCategories ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#85ea10]"></div>
                    <span className="ml-2 text-gray-600 dark:text-white/60">Cargando categorías...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setCourseData(prev => ({ ...prev, category: category.id }))}
                        className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                          courseData.category === category.id
                            ? 'border-[#85ea10] bg-[#85ea10]/10 text-[#85ea10]'
                            : 'border-gray-300 dark:border-gray-600 hover:border-[#85ea10]/50'
                        }`}
                        style={{
                          borderColor: courseData.category === category.id ? category.color : undefined,
                          backgroundColor: courseData.category === category.id ? category.color + '20' : undefined
                        }}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Detalles del Curso
              </h3>
              
              {/* Precio y descuento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio (COP) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={courseData.price || ''}
                      onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="50000"
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    value={courseData.discount_percentage || ''}
                    onChange={(e) => setCourseData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || null }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Duración y calorías */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duración (días) *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={courseData.duration_days || ''}
                      onChange={(e) => setCourseData(prev => ({ ...prev, duration_days: parseInt(e.target.value) || null }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="30"
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Calorías Quemadas
                  </label>
                  <div className="relative">
                    <Flame className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={courseData.calories_burned || ''}
                      onChange={(e) => setCourseData(prev => ({ ...prev, calories_burned: parseInt(e.target.value) || null }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="500"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Nivel del curso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nivel del Curso *
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={courseData.level}
                    onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                    <option value="expert">Experto</option>
                  </select>
                </div>
              </div>

              {/* URL del video introductorio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL del Video Introductorio
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={courseData.intro_video_url}
                    onChange={(e) => setCourseData(prev => ({ ...prev, intro_video_url: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* Preview Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Imagen de Preview
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-[#85ea10] ${
                    dragActive
                      ? 'border-[#85ea10] bg-[#85ea10]/10'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'course')}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleImageUpload(file, 'course');
                      }
                    };
                    input.click();
                  }}
                >
                  {courseData.preview_image ? (
                    <div className="relative">
                      <img
                        src={courseData.preview_image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setCourseData(prev => ({ ...prev, preview_image: null }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handleImageUpload(file, 'course');
                            }
                          };
                          input.click();
                        }}
                        className="bg-[#85ea10] hover:bg-[#7dd30f] text-black px-4 py-2 rounded-lg transition-colors"
                      >
                        Seleccionar Imagen
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], 'course');
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Lecciones del Curso
                </h3>
                <button
                  onClick={addLesson}
                  className="bg-[#85ea10] hover:bg-[#7dd30f] text-black px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Lección</span>
                </button>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Play className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No hay lecciones agregadas</p>
                  <p className="text-sm">Agrega al menos una lección para tu curso</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Lección {lesson.lesson_order}
                        </h4>
                        <button
                          onClick={() => removeLesson(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Título de la Lección * ({lesson.title.length}/100)
                          </label>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(index, 'title', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                              lesson.title.length > 100 
                                ? 'border-red-500 dark:border-red-500' 
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Ej: Introducción al HIIT (máx. 100 caracteres)"
                            maxLength={100}
                          />
                          {lesson.title.length > 100 && (
                            <p className="text-red-500 text-sm mt-1">El título no puede exceder 100 caracteres</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Duración (minutos)
                          </label>
                          <input
                            type="number"
                            value={lesson.duration_minutes}
                            onChange={(e) => updateLesson(index, 'duration_minutes', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="30"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Descripción * ({lesson.description.length}/300)
                        </label>
                        <textarea
                          value={lesson.description}
                          onChange={(e) => updateLesson(index, 'description', e.target.value)}
                          rows={2}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                            lesson.description.length > 300 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Describe qué incluye esta lección... (máx. 300 caracteres)"
                          maxLength={300}
                        />
                        {lesson.description.length > 300 && (
                          <p className="text-red-500 text-sm mt-1">La descripción no puede exceder 300 caracteres</p>
                        )}
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          URL del Video
                        </label>
                        <input
                          type="url"
                          value={lesson.video_url}
                          onChange={(e) => updateLesson(index, 'video_url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Imagen de Preview
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer hover:border-[#85ea10] ${
                            dragActive
                              ? 'border-[#85ea10] bg-[#85ea10]/10'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDrag}
                          onDrop={(e) => handleDrop(e, 'lesson', index)}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                handleImageUpload(file, 'lesson', index);
                              }
                            };
                            input.click();
                          }}
                        >
                          {lesson.preview_image ? (
                            <div className="relative">
                              <img
                                src={lesson.preview_image}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => updateLesson(index, 'preview_image', null)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div>
                              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Arrastra una imagen aquí o haz clic para seleccionar
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                      handleImageUpload(file, 'lesson', index);
                                    }
                                  };
                                  input.click();
                                }}
                                className="bg-[#85ea10] hover:bg-[#7dd30f] text-black px-3 py-1 rounded text-sm transition-colors"
                              >
                                Seleccionar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center">
                        <input
                          type="checkbox"
                          id={`preview-${index}`}
                          checked={lesson.is_preview}
                          onChange={(e) => updateLesson(index, 'is_preview', e.target.checked)}
                          className="h-4 w-4 text-[#85ea10] focus:ring-[#85ea10] border-gray-300 rounded"
                        />
                        <label htmlFor={`preview-${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Esta lección es de preview (gratuita)
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Revisar y Crear Curso
              </h3>
              
              {/* Resumen del curso */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen del Curso
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Título</p>
                    <p className="font-medium text-gray-900 dark:text-white">{courseData.title || 'Sin título'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Categoría</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {categories.find(c => c.id === courseData.category)?.name || 'Sin categoría'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Precio</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${courseData.price} {courseData.discount_percentage > 0 && `(${courseData.discount_percentage}% descuento)`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duración</p>
                    <p className="font-medium text-gray-900 dark:text-white">{courseData.duration_days} días</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Calorías</p>
                    <p className="font-medium text-gray-900 dark:text-white">{courseData.calories_burned} cal</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lecciones</p>
                    <p className="font-medium text-gray-900 dark:text-white">{lessons.length} lecciones</p>
                  </div>
                </div>
              </div>

              {/* Lista de lecciones */}
              {lessons.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Lecciones ({lessons.length})
                  </h4>
                  <div className="space-y-2">
                    {lessons.map((lesson, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {lesson.lesson_order}. {lesson.title || 'Sin título'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lesson.duration_minutes} min {lesson.is_preview && '(Preview)'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancelar
          </button>
          
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Anterior
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!courseData.title || !courseData.description || !courseData.short_description}
                className="px-4 py-2 bg-[#85ea10] hover:bg-[#7dd30f] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isFormValid()}
                className="px-4 py-2 bg-[#85ea10] hover:bg-[#7dd30f] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Crear Curso</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager
          onClose={() => setShowCategoryManager(false)}
          onCategorySelect={(category) => {
            setCourseData(prev => ({ ...prev, category: category.id }));
            setShowCategoryManager(false);
          }}
        />
      )}
    </div>
  );
}

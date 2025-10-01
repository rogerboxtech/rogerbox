'use client';
import { supabase } from '@/lib/supabase';

export interface UnifiedCourse {
  id: string;
  title: string;
  description: string;
  short_description: string;
  thumbnail: string;
  preview_image: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  category_name: string;
  rating: number;
  students_count: number;
  lessons_count: number;
  duration: string;
  level: string;
  isNew: boolean;
  isPopular: boolean;
  created_at: string;
}

class UnifiedCoursesService {
  /**
   * Extrae el thumbnail de YouTube de una URL
   */
  private getYouTubeThumbnail(url: string): string {
    try {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    } catch (error) {
      console.warn('Error al extraer video ID de YouTube:', error);
    }
    return '/images/course-placeholder.jpg';
  }

  /**
   * Corta URLs Base64 largas para evitar payloads gigantes
   */
  private truncateBase64Image(base64String: string | null, maxLength: number = 100): string {
    if (!base64String) return '/images/course-placeholder.jpg';
    
    if (base64String.startsWith('data:image/')) {
      // Si es una imagen Base64, la cortamos y usamos placeholder
      console.warn('🖼️ Imagen Base64 detectada, usando placeholder para optimización');
      return '/images/course-placeholder.jpg';
    }
    
    if (base64String.length > maxLength) {
      return base64String.substring(0, maxLength) + '...';
    }
    
    return base64String;
  }

  /**
   * Obtiene cursos de forma optimizada - SIN Base64
   */
  async getCourses(): Promise<UnifiedCourse[]> {
    try {
      console.log('🚀 UnifiedCourses: Cargando desde Supabase...');

      // Consulta optimizada - SOLO campos esenciales, SIN preview_image
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          short_description,
          price,
          discount_percentage,
          category,
          created_at,
          is_published,
          intro_video_url,
          thumbnail_url,
          video_preview_url,
          preview_image,
          rating,
          students_count,
          calories_burned
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (coursesError) {
        console.error('❌ UnifiedCourses: Error en cursos:', coursesError);
        throw coursesError;
      }

      // Obtener categorías para mapear IDs a nombres
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('course_categories')
        .select('id, name')
        .eq('is_active', true);

      if (categoriesError) {
        console.error('❌ UnifiedCourses: Error en categorías:', categoriesError);
        // Continuar sin categorías si hay error
      }

      // Crear mapa de categorías
      const categoryMap: { [key: string]: string } = {};
      if (categoriesData) {
        categoriesData.forEach(cat => {
          categoryMap[cat.id] = cat.name;
        });
      }

      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const courses = (coursesData || []).map(course => {
        const isNew = new Date(course.created_at) > twoWeeksAgo;

        return {
          id: course.id,
          title: course.title,
          description: course.description || '',
          short_description: course.short_description || '',
          thumbnail: course.preview_image || course.thumbnail_url || (course.intro_video_url ? this.getYouTubeThumbnail(course.intro_video_url) : '/images/course-placeholder.jpg'),
          preview_image: course.preview_image || course.video_preview_url || course.thumbnail_url || (course.intro_video_url ? this.getYouTubeThumbnail(course.intro_video_url) : '/images/course-placeholder.jpg'),
          price: course.price || 0,
          original_price: course.discount_percentage > 0 ? course.price : undefined,
          discount_percentage: course.discount_percentage || 0,
          category_name: categoryMap[course.category] || course.category || 'Sin categoría',
          rating: course.rating || 4.8,
          students_count: course.students_count || 0,
          lessons_count: 12, // Valor fijo ya que no existe en la BD
          duration: '30 min',
          level: 'Intermedio',
          isNew,
          isPopular: false,
          created_at: course.created_at
        };
      });

      console.log(`✅ UnifiedCourses: ${courses.length} cursos cargados (optimizado)`);
      return courses;

    } catch (error) {
      console.error('❌ UnifiedCourses: Error al cargar cursos:', error);
      throw error;
    }
  }

  /**
   * Obtiene un curso específico por ID
   */
  async getCourseById(id: string): Promise<UnifiedCourse | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          short_description,
          price,
          discount_percentage,
          category,
          created_at,
          intro_video_url,
          thumbnail_url,
          video_preview_url,
          preview_image,
          rating,
          students_count,
          calories_burned
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('❌ UnifiedCourses: Error al obtener curso:', error);
        return null;
      }

      // Obtener categoría
      const { data: categoryData } = await supabase
        .from('course_categories')
        .select('name')
        .eq('id', data.category)
        .single();

      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const isNew = new Date(data.created_at) > twoWeeksAgo;

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        short_description: data.short_description || '',
        thumbnail: data.preview_image || data.thumbnail_url || (data.intro_video_url ? this.getYouTubeThumbnail(data.intro_video_url) : '/images/course-placeholder.jpg'),
        preview_image: data.preview_image || data.video_preview_url || data.thumbnail_url || (data.intro_video_url ? this.getYouTubeThumbnail(data.intro_video_url) : '/images/course-placeholder.jpg'),
        price: data.price || 0,
        original_price: data.discount_percentage > 0 ? data.price : undefined,
        discount_percentage: data.discount_percentage || 0,
        category_name: categoryData?.name || data.category || 'Sin categoría',
        rating: data.rating || 4.8,
        students_count: data.students_count || 0,
        lessons_count: 12, // Valor fijo ya que no existe en la BD
        duration: '30 min',
        level: 'Intermedio',
        isNew,
        isPopular: false,
        created_at: data.created_at
      };

    } catch (error) {
      console.error('❌ UnifiedCourses: Error al obtener curso específico:', error);
      return null;
    }
  }
}

export const unifiedCoursesService = new UnifiedCoursesService();
export default unifiedCoursesService;

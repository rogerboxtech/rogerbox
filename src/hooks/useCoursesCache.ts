'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  instructor?: string;
  lessons?: number;
  isRecommended?: boolean;
  thumbnail?: string;
  duration?: string;
  students?: number;
}

interface CacheData {
  courses: Course[];
  totalCount: number;
  lastFetch: number;
  currentPage: number;
  totalPages: number;
}

const CACHE_KEY = 'rogerbox_courses_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos
const COURSES_PER_PAGE = 9;

export function useCoursesCache(userProfile: any) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Verificar si el caché es válido
  const isCacheValid = (cacheData: CacheData): boolean => {
    const now = Date.now();
    return (now - cacheData.lastFetch) < CACHE_DURATION;
  };

  // Cargar desde caché
  const loadFromCache = (): CacheData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const cacheData: CacheData = JSON.parse(cached);
      return isCacheValid(cacheData) ? cacheData : null;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return null;
    }
  };

  // Guardar en caché
  const saveToCache = (data: Omit<CacheData, 'lastFetch'>) => {
    try {
      const cacheData: CacheData = {
        ...data,
        lastFetch: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  // Cargar cursos desde Supabase
  const loadCoursesFromDB = async (page: number = 1) => {
    try {
      console.log(`🔄 Cargando página ${page} desde Supabase...`);
      
      const from = (page - 1) * COURSES_PER_PAGE;
      const to = from + COURSES_PER_PAGE - 1;

      // Obtener total de cursos
      console.log('📊 Obteniendo total de cursos...');
      const { count, error: countError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      if (countError) {
        console.error('❌ Error obteniendo count:', countError);
        throw countError;
      }

      console.log('📊 Total de cursos encontrados:', count);

      // Obtener cursos paginados
      console.log('📊 Obteniendo cursos paginados...');
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('❌ Error obteniendo cursos:', error);
        throw error;
      }

      console.log('📊 Cursos obtenidos:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📊 Primer curso raw:', data[0]);
        console.log('📊 duration_days:', data[0].duration_days);
        console.log('📊 students_count:', data[0].students_count);
      }

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / COURSES_PER_PAGE);

      // Transformar cursos
      const transformedCourses = (data || []).map(course => {
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
        
        const transformed = {
          ...course,
          instructor: 'RogerBox',
          lessons: 1,
          isRecommended: userProfile?.goals?.includes(mappedCategory) || false,
          thumbnail: course.preview_image,
          duration: `${course.duration_days} días`,
          students: course.students_count,
          category: mappedCategory,
          originalCategory: course.category // Mantener la categoría original
        };
        
        console.log('📊 Curso transformado:', {
          title: transformed.title,
          duration_days: transformed.duration_days,
          students: transformed.students,
          students_count: transformed.students_count
        });
        
        return transformed;
      });

      console.log('📊 Cursos transformados:', transformedCourses.length);
      if (transformedCourses.length > 0) {
        console.log('📊 Primer curso transformado:', transformedCourses[0]);
      }

      return {
        courses: transformedCourses,
        totalCount,
        currentPage: page,
        totalPages
      };
    } catch (error) {
      console.error('Error loading courses from DB:', error);
      throw error;
    }
  };

  // Cargar cursos (con caché)
  const loadCourses = async (page: number = 1, forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // Si no es refresh forzado, intentar cargar desde caché
      if (!forceRefresh) {
        const cached = loadFromCache();
        if (cached && cached.currentPage === page) {
          console.log('✅ Cargando desde caché...');
          setCourses(cached.courses);
          setCurrentPage(cached.currentPage);
          setTotalPages(cached.totalPages);
          setTotalCount(cached.totalCount);
          setLoading(false);
          return;
        }
      }

      // Cargar desde base de datos
      console.log('🔄 Cargando desde base de datos...');
      const data = await loadCoursesFromDB(page);
      
      setCourses(data.courses);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);

      // Guardar en caché
      saveToCache(data);
      
    } catch (error) {
      console.error('Error loading courses:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar página
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      loadCourses(page);
    }
  };

  // Refrescar datos
  const refresh = () => {
    loadCourses(currentPage, true);
  };

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🔄 useCoursesCache: userProfile changed:', userProfile?.id);
    if (userProfile) {
      console.log('🚀 useCoursesCache: Starting initial load...');
      // Limpiar caché y forzar recarga
      localStorage.removeItem(CACHE_KEY);
      loadCourses(1, true);
    }
  }, [userProfile?.id]);

  return {
    courses,
    loading,
    currentPage,
    totalPages,
    totalCount,
    error,
    changePage,
    refresh,
    coursesPerPage: COURSES_PER_PAGE
  };
}

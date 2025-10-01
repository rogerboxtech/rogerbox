'use client';
import { useState, useEffect, useCallback } from 'react';
import { unifiedCoursesService, UnifiedCourse } from '@/services/unifiedCoursesService';

interface UseUnifiedCoursesReturn {
  courses: UnifiedCourse[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useUnifiedCourses = (): UseUnifiedCoursesReturn => {
  const [courses, setCourses] = useState<UnifiedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 useUnifiedCourses: Cargando cursos...');
      
      const coursesData = await unifiedCoursesService.getCourses();
      
      console.log(`✅ useUnifiedCourses: ${coursesData.length} cursos cargados`);
      console.log('📊 useUnifiedCourses: Primer curso:', coursesData[0]);
      setCourses(coursesData);
    } catch (err) {
      console.error('❌ useUnifiedCourses: Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    console.log('🔄 useUnifiedCourses: Refrescando...');
    await loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return {
    courses,
    loading,
    error,
    refresh
  };
};

export default useUnifiedCourses;

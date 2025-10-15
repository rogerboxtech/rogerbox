'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

interface UserPurchase {
  id: string;
  course_id: string;
  order_id: string;
  purchase_date: string;
  status: string;
  start_date: string | null;
  course: {
    id: string;
    title: string;
    slug: string;
    preview_image: string;
    duration_days: number;
  };
}

interface UseUserPurchasesReturn {
  purchases: UserPurchase[];
  loading: boolean;
  error: string | null;
  hasActivePurchases: boolean;
  refresh: () => Promise<void>;
}

export const useUserPurchases = (): UseUserPurchasesReturn => {
  const { data: session } = useSession();
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPurchases = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useUserPurchases: Cargando compras del usuario...');
      
      // SIMULACIÓN TEMPORAL: Solo para rogerboxtech@gmail.com
      if (session.user.email === 'rogerboxtech@gmail.com') {
        console.log('🎭 SIMULACIÓN: Usuario rogerbox detectado, simulando compra...');
        const simulatedPurchase: UserPurchase = {
          id: 'sim-001',
          course_id: '1',
          order_id: 'order-sim-001',
          purchase_date: new Date().toISOString(),
          status: 'active',
          start_date: null, // Sin fecha de inicio para mostrar el calendario
          course: {
            id: '1',
            title: 'CARDIO HIIT 40 MIN ¡BAJA DE PESO!',
            slug: 'cardio-hiit-40-min-baja-peso',
            preview_image: '/images/courses/course-1.jpg',
            duration_days: 84
          }
        };
        
        console.log('✅ SIMULACIÓN: Compra simulada creada');
        setPurchases([simulatedPurchase]);
        setLoading(false);
        return;
      }
      
      const { data, error: fetchError } = await supabase
        .from('course_purchases')
        .select(`
          id,
          course_id,
          order_id,
          purchase_date,
          status,
          start_date,
          course:course_id (
            id,
            title,
            slug,
            preview_image,
            duration_days
          )
        `)
        .eq('user_email', session.user.email)
        .eq('status', 'active')
        .order('purchase_date', { ascending: false });

      if (fetchError) {
        console.error('❌ useUserPurchases: Error:', fetchError);
        setError(fetchError.message);
        return;
      }

      console.log(`✅ useUserPurchases: ${data?.length || 0} compras encontradas`);
      
      // Transformar los datos para que coincidan con la interfaz
      const transformedData = data?.map((purchase: any) => ({
        ...purchase,
        course: purchase.course?.[0] || null
      })) || [];
      
      setPurchases(transformedData);
      
    } catch (err) {
      console.error('❌ useUserPurchases: Error general:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadPurchases();
  };

  useEffect(() => {
    loadPurchases();
  }, [session?.user?.email]);

  const hasActivePurchases = purchases.length > 0;

  return {
    purchases,
    loading,
    error,
    hasActivePurchases,
    refresh
  };
};

export default useUserPurchases;

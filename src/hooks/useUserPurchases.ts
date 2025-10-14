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
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useUserPurchases: Cargando compras del usuario...');
      
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
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .order('purchase_date', { ascending: false });

      if (fetchError) {
        console.error('❌ useUserPurchases: Error:', fetchError);
        setError(fetchError.message);
        return;
      }

      console.log(`✅ useUserPurchases: ${data?.length || 0} compras encontradas`);
      setPurchases(data || []);
      
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
  }, [session?.user?.id]);

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

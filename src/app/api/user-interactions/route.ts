import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug API: Iniciando user-interactions');
    const session = await getServerSession(authOptions);
    console.log('🔍 Debug API: Session:', session ? 'existe' : 'no existe');
    console.log('🔍 Debug API: User ID:', session?.user?.id);
    
    if (!session?.user?.id) {
      console.log('❌ Debug API: No hay sesión, devolviendo 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'favorites', 'completed', 'rated'

    let query = supabase
      .from('user_complement_interactions')
      .select(`
        *,
        complements (
          id,
          title,
          description,
          thumbnail_url,
          duration,
          category,
          difficulty,
          is_new,
          complement_stats (
            total_views,
            total_favorites,
            average_rating,
            total_ratings
          )
        )
      `)
      .eq('user_id', session.user.id);

    if (type === 'favorites') {
      query = query.eq('is_favorite', true);
    } else if (type === 'completed') {
      query = query.eq('is_completed', true);
    } else if (type === 'rated') {
      query = query.not('user_rating', 'is', null);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Debug API: Error fetching user interactions:', error);
      return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 });
    }

    console.log('✅ Debug API: Interacciones encontradas:', data.length);
    console.log('📊 Debug API: Datos:', data);

    return NextResponse.json({ interactions: data });
  } catch (error) {
    console.error('Error in GET /api/user-interactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

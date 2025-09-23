import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const complement_id = searchParams.get('complement_id');
    const user_id = searchParams.get('user_id');

    if (!complement_id || !user_id) {
      return NextResponse.json({ error: 'complement_id and user_id are required' }, { status: 400 });
    }

    console.log('🔍 Debug: Buscando interacciones para:', { complement_id, user_id });

    const { data, error } = await supabase
      .from('user_complement_interactions')
      .select('*')
      .eq('user_id', user_id)
      .eq('complement_id', complement_id);

    if (error) {
      console.error('❌ Error en debug:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Debug: Interacciones encontradas:', data);

    return NextResponse.json({ 
      interactions: data,
      debug: true 
    });
  } catch (error) {
    console.error('❌ Error en debug API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

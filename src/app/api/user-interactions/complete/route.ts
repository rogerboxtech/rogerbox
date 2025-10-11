import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
  const session = (await getServerSession(authOptions)) as any;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { complement_id } = body;

    if (!complement_id) {
      return NextResponse.json({ error: 'Complement ID is required' }, { status: 400 });
    }

    // Verificar que el complemento existe
    const { data: complement, error: complementError } = await supabase
      .from('complements')
      .select('id')
      .eq('id', complement_id)
      .eq('is_active', true)
      .single();

    if (complementError || !complement) {
      return NextResponse.json({ error: 'Complement not found' }, { status: 404 });
    }

    // Obtener la interacción actual
    const { data: currentInteraction } = await supabase
      .from('user_complement_interactions')
      .select('times_completed, last_completed_at')
      .eq('user_id', session.user.id)
      .eq('complement_id', complement_id)
      .single();

    const currentTimesCompleted = currentInteraction?.times_completed || 0;
    // Siempre incrementar el contador cuando se hace clic
    const newTimesCompleted = currentTimesCompleted + 1;

    // Insertar o actualizar la interacción
    const { data, error } = await supabase
      .from('user_complement_interactions')
      .upsert({
        user_id: session.user.id,
        complement_id,
        is_completed: true, // Siempre marcar como completado
        times_completed: newTimesCompleted,
        last_completed_at: new Date().toISOString(), // Siempre actualizar la fecha
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,complement_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating completion:', error);
      return NextResponse.json({ error: 'Failed to update completion' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      is_completed: true, // Siempre devolver true
      times_completed: data.times_completed,
      last_completed_at: data.last_completed_at
    });
  } catch (error) {
    console.error('Error in POST /api/user-interactions/complete:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

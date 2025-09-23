'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Onboarding from '@/components/Onboarding';
import SimpleLoading from '@/components/SimpleLoading';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  height: number;
  weight: number;
  gender: string;
  birthYear?: number;
  goals: string[];
  target_weight: number | null;
  dietaryHabits?: string[];
  membership_status: string;
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleComplete = async (profile: UserProfile) => {
    if (!session?.user?.email || !session?.user?.id) {
      console.error('No hay sesión de usuario');
      return;
    }

    setIsUpdating(true);

    try {
      console.log('=== DEBUG ONBOARDING ===');
      console.log('Session user ID:', session.user.id);
      console.log('Session user email:', session.user.email);
      console.log('Profile data:', profile);
      console.log('========================');

      // Primero intentar actualizar el perfil existente
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (selectError) {
        console.error('Error verificando perfil existente:', selectError);
        alert('Error al verificar el perfil. Intenta de nuevo.');
        return;
      }

      let error;
      if (existingProfile) {
        // Actualizar perfil existente
        console.log('Actualizando perfil existente...');
        const updateData = {
          name: profile.name || session.user.name || 'Usuario',
          height: profile.height,
          weight: profile.weight,
          gender: profile.gender,
          goals: profile.goals,
          updated_at: new Date().toISOString()
        };

        // Solo agregar campos si existen
        if (profile.birthYear) {
          updateData.birth_year = profile.birthYear;
        }
        if (profile.dietaryHabits && profile.dietaryHabits.length > 0) {
          updateData.dietary_habits = profile.dietaryHabits;
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', session.user.id);
        error = updateError;
      } else {
        // Crear nuevo perfil
        console.log('Creando nuevo perfil...');
        const insertData = {
          id: session.user.id,
          name: profile.name || session.user.name || 'Usuario',
          email: session.user.email,
          height: profile.height,
          weight: profile.weight,
          gender: profile.gender,
          goals: profile.goals,
          membership_status: 'inactive',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Solo agregar campos si existen
        if (profile.birthYear) {
          insertData.birth_year = profile.birthYear;
        }
        if (profile.dietaryHabits && profile.dietaryHabits.length > 0) {
          insertData.dietary_habits = profile.dietaryHabits;
        }

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(insertData);
        error = insertError;
      }

      if (error) {
        console.error('Error guardando perfil:', error);
        alert('Error al guardar el perfil. Intenta de nuevo.');
        return;
      }

      console.log('Perfil guardado exitosamente');
      
      // Redirigir al dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === 'loading') {
    return <SimpleLoading message="Preparando tu experiencia..." size="lg" />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Onboarding 
        onComplete={handleComplete} 
        isUpdating={isUpdating}
        userName={session?.user?.name || 'Usuario'}
      />
    </div>
  );
}
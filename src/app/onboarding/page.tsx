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
  goals: string[];
  target_weight: number | null;
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
    if (!session?.user?.email) {
      console.error('No hay sesión de usuario');
      return;
    }

    setIsUpdating(true);

    try {
      console.log('Actualizando perfil con datos:', profile);

      // Actualizar el perfil en Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          height: profile.height,
          weight: profile.weight,
          gender: profile.gender,
          goals: profile.goals,
          target_weight: profile.targetWeight
        })
        .eq('email', session.user.email);

      if (error) {
        console.error('Error actualizando perfil:', error);
        alert('Error al guardar el perfil. Intenta de nuevo.');
        return;
      }

      console.log('Perfil actualizado exitosamente');
      
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
    <div className="min-h-screen bg-gradient-to-br from-[#164151]/80 via-[#29839c]/70 to-[#29839c]/60">
      <Onboarding onComplete={handleComplete} isUpdating={isUpdating} />
    </div>
  );
}
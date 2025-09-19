'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CourseDashboard from '@/components/CourseDashboard';
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular loading más largo para demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 segundos de loading

    return () => clearTimeout(timer);
  }, []);

  // Obtener datos del perfil desde Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.email) {
        try {
          console.log('Dashboard: Buscando perfil para email:', session.user.email);
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          if (error) {
            console.error('Dashboard: Error fetching profile:', error);
            setLoading(false);
            return;
          }

          if (data) {
            console.log('Dashboard: Perfil encontrado:', data);
            console.log('Dashboard: Nombre del perfil:', data.name);
            console.log('Dashboard: Email del perfil:', data.email);
            setUserProfile(data);
          } else {
            console.log('Dashboard: No se encontró perfil en Supabase, creando uno nuevo');
            // Crear perfil en Supabase si no existe
            const newProfile = {
              id: session.user.id || '',
              name: session.user.name || 'Usuario',
              email: session.user.email || '',
              height: 170,
              weight: 70,
              gender: 'other' as const,
              goals: [],
              target_weight: null,
              membership_status: 'inactive' as const
            };

            // Insertar en Supabase
            const { data: insertData, error: insertError } = await supabase
              .from('profiles')
              .insert([newProfile])
              .select();

            if (insertError) {
              console.error('Error creando perfil:', insertError);
              // Si es error de duplicado, buscar el perfil existente
              if (insertError.code === '23505') {
                console.log('Perfil ya existe, buscando...');
                const { data: existingData } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                
                if (existingData) {
                  console.log('Perfil existente encontrado:', existingData);
                  setUserProfile(existingData);
                } else {
                  setUserProfile(newProfile);
                }
              } else {
                setUserProfile(newProfile);
              }
            } else {
              console.log('Perfil creado en Supabase:', insertData);
              setUserProfile(insertData[0]);
            }
          }
        } catch (error) {
          console.error('Dashboard: Error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [session, status, router]);

  // Refrescar datos cada vez que se monta el componente
  useEffect(() => {
    if (session?.user?.email) {
      const refreshProfile = async () => {
        try {
          console.log('Dashboard: Refrescando perfil...');
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.user.email);

          if (!error && data && data.length > 0) {
            console.log('Dashboard: Perfil actualizado:', data[0]);
            setUserProfile(data[0]);
          }
        } catch (error) {
          console.error('Error refreshing profile:', error);
        }
      };
      
      refreshProfile();
    }
  }, [session?.user?.email]);

  if (status === 'loading' || loading) {
    return <SimpleLoading message="Cargando dashboard..." size="lg" showProgress={true} />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (!userProfile) {
    return <SimpleLoading message="Cargando perfil..." size="lg" showProgress={true} />;
  }

  return <CourseDashboard userProfile={userProfile} />;
}
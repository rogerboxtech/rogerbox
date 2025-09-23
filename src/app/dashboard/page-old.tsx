'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Play, Clock, Users, Star, Filter, Search, User, LogOut, ChevronDown, ShoppingCart, Heart, BookOpen, Target, Zap, Utensils, ChefHat, Award, TrendingUp } from 'lucide-react';
import Footer from '@/components/Footer';
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

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
  description: string;
  lessons: number;
  isRecommended?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

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
      if (session?.user?.id) {
        try {
          console.log('Dashboard: Buscando perfil para ID:', session.user.id);
          
          // Primero buscar por ID (más confiable)
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          // Si no hay perfil o el perfil está incompleto, redirigir al onboarding
          if (!data || !data.goals || data.goals.length === 0) {
            console.log('Dashboard: Perfil incompleto o no encontrado, redirigiendo al onboarding');
            router.push('/onboarding');
            return;
          }

          if (error) {
            console.error('Dashboard: Error fetching profile:', error);
            setLoading(false);
            return;
          }

          if (data) {
            console.log('Dashboard: Perfil encontrado por ID:', data);
            setUserProfile(data);
          } else {
            console.log('Dashboard: No se encontró perfil por ID, buscando por email...');
            // Buscar por email como fallback
            const { data: emailData, error: emailError } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', session.user.email)
              .maybeSingle();

            if (emailError) {
              console.error('Dashboard: Error buscando por email:', emailError);
              setLoading(false);
              return;
            }

            if (emailData) {
              console.log('Dashboard: Perfil encontrado por email:', emailData);
              setUserProfile(emailData);
            } else {
              console.log('Dashboard: No se encontró perfil, creando uno nuevo');
              // Crear perfil básico solo en memoria, no en Supabase
              const newProfile = {
                id: session.user.id,
                name: session.user.name || 'Usuario',
                email: session.user.email || '',
                height: 170,
                weight: 70,
                gender: 'other' as const,
                goals: [],
                target_weight: null,
                membership_status: 'inactive' as const
              };
              
              console.log('Dashboard: Usando perfil local:', newProfile);
              setUserProfile(newProfile);
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
    if (session?.user?.id && !userProfile) {
      const refreshProfile = async () => {
        try {
          console.log('Dashboard: Refrescando perfil...');
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && data) {
            console.log('Dashboard: Perfil actualizado:', data);
            setUserProfile(data);
          }
        } catch (error) {
          console.error('Error refreshing profile:', error);
        }
      };
      
      refreshProfile();
    }
  }, [session?.user?.id, userProfile]);

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
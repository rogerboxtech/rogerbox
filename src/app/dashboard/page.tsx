'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appStore } from '@/lib/store';
import { User } from '@/types';
import StudentDashboard from '@/components/StudentDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      const state = appStore.getState();
      setCurrentUser(state.currentUser);
    });

    const state = appStore.getState();
    setCurrentUser(state.currentUser);
    setIsLoading(false);

    return unsubscribe;
  }, []);

  // Si no hay usuario, redirigir al registro
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/register');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#85ea10] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Se redirigirá automáticamente
  }

  return (
    <StudentDashboard 
      user={currentUser} 
      onBack={() => router.push('/')} 
    />
  );
}

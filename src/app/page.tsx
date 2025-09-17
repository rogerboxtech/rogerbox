'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/register');
  };

  return <LandingPage onLogin={handleLogin} />;
}
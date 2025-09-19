'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleBackToLanding = () => {
    setShowLogin(false);
  };

  if (showLogin) {
    // Aquí iría el formulario de login
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Formulario de Login</h1>
          <p className="text-white mb-6">Próximamente...</p>
          <button
            onClick={handleBackToLanding}
            className="px-6 py-3 bg-[#85ea10] text-black font-bold rounded-lg"
          >
            Volver a la Landing
          </button>
        </div>
      </div>
    );
  }

  return <LandingPage onLogin={handleLogin} />;
}
'use client';

import { useState, useEffect } from 'react';

interface SimpleLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export default function SimpleLoading({ 
  message = "Cargando...", 
  size = 'md',
  showProgress = false
}: SimpleLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const loadingMessages = [
    "Preparando tu rutina...",
    "Calentando motores...",
    "Cargando ejercicios...",
    "¡Casi listo!",
    "Preparando la sesión...",
    "Cargando videos...",
    "¡Listo para entrenar!"
  ];

  useEffect(() => {
    if (showProgress) {
      // Simular progreso suave
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 8;
        });
      }, 300);

      // Cambiar mensajes
      const messageInterval = setInterval(() => {
        setCurrentMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2000);

      return () => {
        clearInterval(interval);
        clearInterval(messageInterval);
      };
    }
  }, [showProgress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#164151]/80 via-[#29839c]/70 to-[#29839c]/60 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation - Muy sutil */}
      <div className="absolute inset-0">
        {/* Floating Exercise Icons - Muy suaves */}
        <div className="absolute top-20 left-10 animate-pulse delay-100">
          <div className="w-6 h-6 bg-[#85ea10]/10 rounded-full flex items-center justify-center">
            <span className="text-lg">💪</span>
          </div>
        </div>
        <div className="absolute top-32 right-16 animate-pulse delay-300">
          <div className="w-5 h-5 bg-[#85ea10]/10 rounded-full flex items-center justify-center">
            <span className="text-sm">🏃</span>
          </div>
        </div>
        <div className="absolute bottom-32 left-20 animate-pulse delay-500">
          <div className="w-7 h-7 bg-[#85ea10]/10 rounded-full flex items-center justify-center">
            <span className="text-lg">🔥</span>
          </div>
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse delay-700">
          <div className="w-6 h-6 bg-[#85ea10]/10 rounded-full flex items-center justify-center">
            <span className="text-sm">⚡</span>
          </div>
        </div>
      </div>

      <div className="text-center z-10 relative">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="relative">
            {/* Muy sutil glow */}
            <div className="absolute inset-0 bg-[#85ea10] blur-xl opacity-10 rounded-full scale-105"></div>
            
            {/* Logo Container */}
            <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Logo Text */}
              <div className="relative z-10">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-wider">
                  ROGER<span className="text-[#85ea10]">BOX</span>
                </h1>
                
                {/* Línea sutil */}
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#85ea10] to-transparent mx-auto"></div>
                
                {/* Dots muy sutiles */}
                <div className="flex justify-center space-x-2 mt-4">
                  <div className="w-1.5 h-1.5 bg-[#85ea10]/60 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-[#85ea10]/60 rounded-full animate-pulse delay-300"></div>
                  <div className="w-1.5 h-1.5 bg-[#85ea10]/60 rounded-full animate-pulse delay-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            {showProgress ? currentMessage : message}
          </h2>
          
          {/* Dots muy sutiles */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-[#85ea10]/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#85ea10]/60 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-[#85ea10]/60 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>

        {/* Progress Bar - Solo si se solicita */}
        {showProgress && (
          <div className="w-80 mx-auto mb-8">
            <div className="bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-[#85ea10] to-[#7dd30f] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="mt-3 text-white/70 text-sm font-medium">
              {Math.round(Math.min(progress, 100))}%
            </div>
          </div>
        )}

        {/* Spinner - Solo si no hay progreso */}
        {!showProgress && (
          <div className={`${sizeClasses[size]} border-4 border-white/20 border-t-[#85ea10] rounded-full animate-spin mx-auto mb-4`}></div>
        )}

        {/* Motivational Text - Más sutil */}
        <div className="mt-6 text-white/50 text-sm max-w-md mx-auto">
          <p>
            "Cada repetición te acerca a tu meta" 💪
          </p>
        </div>
      </div>
    </div>
  );
}

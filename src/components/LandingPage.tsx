'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Users, Clock, MapPin, CheckCircle, Star, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState<'basic' | 'pro'>('basic');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Single Blur Overlay for entire page - left side darker */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#164151]/80 via-[#29839c]/70 to-[#164151]/60 backdrop-blur-sm z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
            {/* Header */}
            <header className="bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-white">
                      ROGER
                      <span className="text-[#85ea10]">BOX</span>
                    </h1>
              </div>
              
              {/* Navigation */}
                  <nav className="hidden md:flex items-center space-x-8">
                    <a href="#" className="text-white hover:text-[#85ea10] transition-colors font-semibold border-b-2 border-[#85ea10] pb-1">INICIO</a>
                    <a href="#" className="text-white hover:text-[#85ea10] transition-colors font-semibold">ACERCA</a>
                    <a href="#" className="text-white hover:text-[#85ea10] transition-colors font-semibold">PLANES</a>
                    <a href="#" className="text-white hover:text-[#85ea10] transition-colors font-semibold">CONTACTO</a>
                    <button 
                      onClick={() => router.push('/register')}
                      className="text-white hover:text-[#85ea10] transition-colors font-semibold"
                    >
                      INICIAR SESIÓN
                    </button>
                    <button 
                      onClick={() => router.push('/admin')}
                      className="text-white/60 hover:text-[#85ea10] transition-colors text-sm"
                      title="Panel de Administración"
                    >
                      ADMIN
                    </button>
                  </nav>
              
                  {/* Sign Up Button */}
                  <button
                    onClick={() => router.push('/register')}
                    className="px-6 py-3 bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold rounded-lg transition-colors"
                  >
                    REGISTRARSE
                  </button>
            </div>
          </div>
        </header>

            {/* Hero Section - Netflix Style */}
            <section className="relative min-h-screen flex items-center">
              {/* Content */}
              <div className="relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
                    
                    {/* Left Side - Video Preview */}
                    <div className="relative">
                      {/* Video Container - Gradient Fade Effect */}
                      <div className="relative max-w-sm mx-auto lg:mx-0">
                        <div className="aspect-[9/16] relative">
                          {/* Roger's Video - Extra Diffused */}
                          <video 
                            className="w-full h-full object-cover rounded-2xl opacity-60"
                            autoPlay
                            loop
                            muted
                            playsInline
                          >
                            <source src="/roger.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                          </video>
                          {/* Gradient fade overlay - clear top, faded bottom with bg colors */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#103e51]/95 rounded-2xl"></div>
                          {/* Additional vertical fade using exact bg gradient colors */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#12222a]/30 to-[#0a1a1f]/90 rounded-2xl mix-blend-multiply"></div>
                          {/* Final blend using the exact background gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#0a1a1f]/85 rounded-2xl mix-blend-overlay"></div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Registration Form */}
                    <div className="p-8">
                      <div className="text-left mb-8">
                        <h1 className="text-4xl font-black text-white mb-4">
                          REGÍSTRATE
                        </h1>
                        <p className="text-lg text-white mb-6 leading-relaxed">
                          Entrenamientos HIIT profesionales con Roger Barreto. 
                          Rutinas exclusivas que transforman tu cuerpo y mente.
                        </p>
                      </div>

                      {/* Registration Form */}
                      <form className="space-y-6">
                        <div>
                          <label className="block text-white font-bold text-sm mb-2">
                            NOMBRE COMPLETO
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-4 bg-black/60 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10]"
                            placeholder="Tu nombre completo"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white font-bold text-sm mb-2">
                            EMAIL
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-4 bg-black/60 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10]"
                            placeholder="tu.email@ejemplo.com"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-bold text-sm mb-2">
                            CONTRASEÑA
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-4 bg-black/60 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10]"
                            placeholder="Tu contraseña"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-bold text-sm mb-2">
                            PESO (KG)
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-4 bg-black/60 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10]"
                            placeholder="70"
                            min="30"
                            max="300"
                            step="0.1"
                          />
                        </div>

                        
                        <button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push('/onboarding');
                          }}
                          className="w-full bg-[#85ea10] hover:bg-[#7dd30f] text-black font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-xl"
                        >
                          🚀 REGISTRARME AHORA
                        </button>

                        <button
                          type="button"
                          onClick={() => router.push('/register')}
                          className="w-full bg-transparent border-2 border-white/30 hover:border-[#85ea10] text-white hover:text-[#85ea10] font-bold py-4 rounded-xl transition-all duration-300 text-lg"
                        >
                          ¿Ya te registraste? Inicia sesión
                        </button>
                      </form>

                      {/* Trust Indicators */}
                      <div className="mt-6 text-center">
                        <p className="text-white text-sm">
                          Solo $1 · Acceso inmediato · Videos exclusivos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


      </div>

    </div>
  );
}
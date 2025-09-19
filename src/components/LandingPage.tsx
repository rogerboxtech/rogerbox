'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Play, Users, Clock, MapPin, CheckCircle, Star, ArrowRight, Zap, Shield, Globe, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState<'basic' | 'pro'>('basic');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [registerError, setRegisterError] = useState('');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);
    setRegisterError('');

    try {
      console.log('Iniciando registro con:', formData.email);
      
      // Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim()
          }
        }
      });

      console.log('Respuesta de Supabase Auth:', { authData, authError });

      if (authError) {
        console.error('Error de autenticación:', authError);
        setRegisterError(authError.message);
        return;
      }

      if (authData.user) {
        console.log('Usuario creado:', authData.user.id);
        
        // Crear perfil en la tabla profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name.trim(),
            email: formData.email.trim(),
            weight: 0,
            height: 0,
            gender: 'other',
            goals: [],
            target_weight: null,
            membership_status: 'inactive'
          })
          .select();

        if (profileError) {
          console.error('Error creating profile:', profileError);
          setRegisterError(`Error al crear el perfil: ${profileError.message}`);
          return;
        }

        // Hacer login automático con NextAuth
        const result = await signIn('credentials', {
          email: formData.email.trim(),
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          console.error('NextAuth login error:', result.error);
          setRegisterError('Error al iniciar sesión automáticamente');
          return;
        }

        console.log('Registro exitoso, redirigiendo al onboarding');
        router.push('/onboarding');
      } else {
        // Caso donde se requiere confirmación de email
        console.log('Se requiere confirmación de email');
        setRegisterError('Te hemos enviado un email de confirmación. Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (registerError) {
      setRegisterError('');
    }
  };

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
                      onClick={onLogin}
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
              
                  {/* Login Button */}
                  <button
                    onClick={onLogin}
                    className="px-6 py-3 bg-[#85ea10] hover:bg-[#7dd30f] text-black font-bold rounded-lg transition-colors"
                  >
                    INICIAR SESIÓN
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

                      {/* Error Message */}
                      {registerError && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <p className="text-red-400 text-sm">{registerError}</p>
                        </div>
                      )}

                      {/* Registration Form */}
                      <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                          <label className="block text-white font-bold text-sm mb-2">
                            NOMBRE COMPLETO
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-4 py-4 bg-black/60 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.name 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-white/30 focus:ring-[#85ea10] focus:border-[#85ea10]'
                            }`}
                            placeholder="Tu nombre completo"
                            disabled={isRegistering}
                          />
                          {errors.name && (
                            <p className="text-red-400 text-sm mt-1 flex items-center">
                              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                              {errors.name}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-white font-bold text-sm mb-2">
                            EMAIL
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-4 py-4 bg-black/60 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.email 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-white/30 focus:ring-[#85ea10] focus:border-[#85ea10]'
                            }`}
                            placeholder="tu.email@ejemplo.com"
                            disabled={isRegistering}
                          />
                          {errors.email && (
                            <p className="text-red-400 text-sm mt-1 flex items-center">
                              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-white font-bold text-sm mb-2">
                            CONTRASEÑA
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className={`w-full px-4 py-4 pr-12 bg-black/60 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                errors.password 
                                  ? 'border-red-500 focus:ring-red-500' 
                                  : 'border-white/30 focus:ring-[#85ea10] focus:border-[#85ea10]'
                              }`}
                              placeholder="Mínimo 6 caracteres"
                              disabled={isRegistering}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                              disabled={isRegistering}
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-red-400 text-sm mt-1 flex items-center">
                              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isRegistering}
                          className="w-full bg-[#85ea10] hover:bg-[#7dd30f] disabled:bg-gray-600 text-black font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-xl flex items-center justify-center space-x-3"
                        >
                          {isRegistering ? (
                            <>
                              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              <span>CREANDO CUENTA...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              <span>REGISTRARME AHORA</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={onLogin}
                          className="w-full bg-transparent border-2 border-white/30 hover:border-[#85ea10] text-white hover:text-[#85ea10] font-bold py-4 rounded-xl transition-all duration-300 text-lg"
                          disabled={isRegistering}
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
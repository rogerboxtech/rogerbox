'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [resetEmail, setResetEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleBackToLanding = () => {
    setShowLogin(false);
    setShowForgotPassword(false);
    setLoginError('');
    setResetError('');
    setResetSuccess(false);
    setErrors({});
    setLoginData({ email: '', password: '' });
    setResetEmail('');
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetError('');
    setResetSuccess(false);
    setResetEmail('');
  };

  const validateLoginForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!loginData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      console.log('Iniciando sesión con:', loginData.email);
      
      const result = await signIn('credentials', {
        email: loginData.email.trim(),
        password: loginData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Login error:', result.error);
        if (result.error === 'CredentialsSignin') {
          setLoginError('Email o contraseña incorrectos');
        } else {
          setLoginError('Error al iniciar sesión. Inténtalo de nuevo.');
        }
        return;
      }

      if (result?.ok) {
        console.log('Login exitoso, redirigiendo al dashboard');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      setResetError('Por favor, ingresa tu email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('El formato del email no es válido');
      return;
    }

    setIsResettingPassword(true);
    setResetError('');

    try {
      console.log('Enviando email de reset para:', resetEmail);
      
      // Importar supabase dinámicamente
      const { supabase } = await import('@/lib/supabase');
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
        data: {
          app_name: 'RogerBox',
          app_logo: `${window.location.origin}/logo.svg`,
        }
      });

      if (error) {
        console.error('Error resetting password:', error);
        setResetError('Error al enviar el email. Por favor, intenta nuevamente.');
        return;
      }

      setResetSuccess(true);
      console.log('Email de reset enviado exitosamente');
      
    } catch (error) {
      console.error('Reset password error:', error);
      setResetError('Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Single Blur Overlay for entire page */}
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
                
                {/* Back Button */}
                <button
                  onClick={handleBackToLogin}
                  className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Volver al Login</span>
                </button>
              </div>
            </div>
          </header>

          {/* Reset Password Section */}
          <section className="relative min-h-screen flex items-center">
            <div className="relative z-10 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center min-h-screen py-20">
                  
                  {/* Reset Password Form Container */}
                  <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                      <h1 className="text-4xl font-black text-white mb-4">
                        RECUPERAR CONTRASEÑA
                      </h1>
                      <p className="text-lg text-white/80 mb-6">
                        Te enviaremos un enlace para restablecer tu contraseña
                      </p>
                    </div>

                    {/* Success Message */}
                    {resetSuccess && (
                      <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-green-900" />
                          </div>
                          <div className="flex-1">
                            <p className="text-green-200 text-sm leading-relaxed">
                              ¡Email enviado! Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {resetError && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-red-200 text-sm">{resetError}</p>
                        </div>
                      </div>
                    )}

                    {/* Reset Password Form */}
                    {!resetSuccess ? (
                      <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                          <label className="block text-white font-bold text-sm mb-2">
                            EMAIL
                          </label>
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full px-4 py-4 bg-black/60 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#85ea10] focus:border-[#85ea10] transition-all"
                            placeholder="tu.email@ejemplo.com"
                            disabled={isResettingPassword}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isResettingPassword}
                          className="w-full bg-[#85ea10] hover:bg-[#7dd30f] disabled:bg-gray-600 text-black font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-xl flex items-center justify-center space-x-3"
                        >
                          {isResettingPassword ? (
                            <>
                              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              <span>ENVIANDO...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              <span>ENVIAR ENLACE</span>
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      <div className="text-center">
                        <button
                          onClick={handleBackToLogin}
                          className="w-full bg-transparent border-2 border-white/30 hover:border-[#85ea10] text-white hover:text-[#85ea10] font-bold py-4 rounded-xl transition-all duration-300 text-lg"
                        >
                          Volver al Login
                        </button>
                      </div>
                    )}

                    {/* Trust Indicators */}
                    <div className="mt-6 text-center">
                      <p className="text-white/60 text-sm">
                        Te enviaremos un enlace seguro para restablecer tu contraseña
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

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Single Blur Overlay for entire page */}
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
                
                {/* Back Button */}
                <button
                  onClick={handleBackToLanding}
                  className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Volver</span>
                </button>
              </div>
            </div>
          </header>

          {/* Login Section */}
          <section className="relative min-h-screen flex items-center">
            <div className="relative z-10 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center min-h-screen py-20">
                  
                  {/* Login Form Container */}
                  <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                      <h1 className="text-4xl font-black text-white mb-4">
                        INICIAR SESIÓN
                      </h1>
                      <p className="text-lg text-white/80 mb-6">
                        Accede a tu cuenta y continúa tu transformación
                      </p>
                    </div>

                    {/* Error Message */}
                    {loginError && (
                      <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{loginError}</p>
                      </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      <div>
                        <label className="block text-white font-bold text-sm mb-2">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          value={loginData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-4 py-4 bg-black/60 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.email 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-white/30 focus:ring-[#85ea10] focus:border-[#85ea10]'
                          }`}
                          placeholder="tu.email@ejemplo.com"
                          disabled={isLoggingIn}
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
                            value={loginData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`w-full px-4 py-4 pr-12 bg-black/60 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.password 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-white/30 focus:ring-[#85ea10] focus:border-[#85ea10]'
                            }`}
                            placeholder="Tu contraseña"
                            disabled={isLoggingIn}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            disabled={isLoggingIn}
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
                        disabled={isLoggingIn}
                        className="w-full bg-[#85ea10] hover:bg-[#7dd30f] disabled:bg-gray-600 text-black font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-xl flex items-center justify-center space-x-3"
                      >
                        {isLoggingIn ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span>INICIANDO SESIÓN...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>INICIAR SESIÓN</span>
                          </>
                        )}
                      </button>

                      {/* Forgot Password Link */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-[#85ea10] hover:text-[#7dd30f] text-sm font-medium transition-colors underline"
                          disabled={isLoggingIn}
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleBackToLanding}
                        className="w-full bg-transparent border-2 border-white/30 hover:border-[#85ea10] text-white hover:text-[#85ea10] font-bold py-4 rounded-xl transition-all duration-300 text-lg"
                        disabled={isLoggingIn}
                      >
                        ¿No tienes cuenta? Regístrate
                      </button>
                    </form>

                    {/* Trust Indicators */}
                    <div className="mt-6 text-center">
                      <p className="text-white/60 text-sm">
                        Acceso seguro · Datos protegidos
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

  return <LandingPage onLogin={handleLogin} />;
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, Calendar, Zap, CheckCircle, X, Clock, TrendingUp, Award, Settings, ExternalLink } from 'lucide-react';
import { GoalSuggestion, getDifficultyColor, getDifficultyEmoji } from '@/lib/goalSuggestion';

interface GoalSuggestionCardProps {
  suggestion: GoalSuggestion;
  onAccept: (suggestion: GoalSuggestion) => void;
  onCustomize: () => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export default function GoalSuggestionCard({ 
  suggestion, 
  onAccept, 
  onCustomize,
  onDismiss, 
  isLoading = false 
}: GoalSuggestionCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Función para obtener la ruta del curso basada en el nombre
  const getCoursePath = (courseName: string): string => {
    // Mapeo de nombres de cursos a sus IDs/rutas basado en los cursos existentes
    const courseMap: { [key: string]: string } = {
      'CARDIO HIIT 40 MIN ¡BAJA DE PESO!': '/course/1', // Transformación Total 90 Días
      'RUTINA HIIT ¡ENTRENA 12 MINUTOS EN VACACIONES!': '/course/2', // HIIT Quema Grasa
      'FULL BODY EXPRESS ¡ENTRENA 12 MINUTOS EN VACACIONES!': '/course/3', // Fuerza y Músculo
    };
    
    return courseMap[courseName] || '/courses';
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  💡 Te Sugerimos una Meta
                </h3>
                <p className="text-sm text-gray-600 dark:text-white/70">
                  Basada en tu perfil, pero puedes personalizarla
                </p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main suggestion */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {suggestion.title}
            </h4>
            <p className="text-gray-600 dark:text-white/70 mb-4">
              {suggestion.description}
            </p>
            
            {/* Motivation */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-700 dark:text-white">
                  {suggestion.motivation}
                </p>
              </div>
            </div>

            {/* Goal details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {suggestion.targetWeight} kg
                </div>
                <div className="text-xs text-gray-600 dark:text-white/60">
                  Peso objetivo
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {suggestion.estimatedDuration}
                </div>
                <div className="text-xs text-gray-600 dark:text-white/60">
                  Duración estimada
                </div>
              </div>
              
              <Link 
                href={getCoursePath(suggestion.recommendedCourse)}
                className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center hover:bg-white/70 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
              >
                <div className={`text-2xl font-bold mb-1 ${getDifficultyColor(suggestion.difficulty).split(' ')[0]}`}>
                  {getDifficultyEmoji(suggestion.difficulty)}
                </div>
                <div className="text-xs text-gray-600 dark:text-white/60 font-medium group-hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-1">
                  <span className="truncate">{suggestion.recommendedCourse}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </div>
              </Link>
            </div>

            {/* Toggle details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              <span>{showDetails ? 'Ocultar detalles' : 'Ver detalles del plan'}</span>
              <TrendingUp className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>

            {/* Detailed plan */}
            {showDetails && (
              <div className="mt-4 bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Award className="w-4 h-4 text-blue-600 mr-2" />
                  Tu Plan Personalizado
                </h5>
                <ul className="space-y-2">
                  {suggestion.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700 dark:text-white">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/20">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>Fecha límite: {new Date(suggestion.deadline).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={() => onAccept(suggestion)}
                disabled={isLoading}
                className="flex-1 bg-[#85ea10] hover:bg-[#7dd30f] disabled:bg-gray-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    <span>Estableciendo meta...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                      <span>¡Acepto el Reto!</span>
                  </>
                )}
              </button>
              
              <button
                onClick={onCustomize}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                <Settings className="w-4 h-4" />
                <span>Personalizar</span>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onDismiss}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-white/30 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No establecer meta ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Scale, X, Calendar } from 'lucide-react';

interface WeeklyWeightReminderProps {
  onClose: () => void;
  onWeightSubmit: (weight: number) => void;
}

export default function WeeklyWeightReminder({ onClose, onWeightSubmit }: WeeklyWeightReminderProps) {
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || isNaN(Number(weight))) return;

    setIsSubmitting(true);
    try {
      // Aquí se enviaría el peso a la base de datos
      await onWeightSubmit(Number(weight));
      onClose();
    } catch (error) {
      console.error('Error al guardar peso:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                ¡Es Viernes! 📅
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hora de pesarte
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Recordatorio Semanal
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Cada viernes te recordamos pesarte para registrar tus avances y mantener tu progreso actualizado.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ¿Cuál es tu peso actual? (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ej: 70.5"
                step="0.1"
                min="30"
                max="300"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Recordar más tarde
              </button>
              <button
                type="submit"
                disabled={!weight || isSubmitting}
                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    <span>Registrar Peso</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Tip: Pésate siempre a la misma hora para obtener mediciones más precisas
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { X, CreditCard, Smartphone, Building, CalendarDays, Flame, Infinity, Dumbbell } from 'lucide-react';

interface WompiPaymentWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: number;
    original_price?: number;
    duration_days?: number;
    description?: string;
    short_description?: string;
    calories_burned?: number;
    level?: string;
    preview_image?: string;
  };
  customerEmail: string;
  customerName: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export default function WompiPaymentWidget({
  isOpen,
  onClose,
  course,
  customerEmail,
  customerName,
  onSuccess,
  onError
}: WompiPaymentWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Calcular precios
  const finalPrice = course.price;
  const originalPrice = course.original_price || course.price;
  const discountAmount = originalPrice - finalPrice;
  const discountPercentage = originalPrice > finalPrice ? Math.round((discountAmount / originalPrice) * 100) : 0;

  // Función para manejar el clic del botón de pago
  const handlePaymentClick = async () => {
    setIsLoading(true);
    
    // Guardar datos en localStorage para evitar URL muy larga
    localStorage.setItem('checkout_course', JSON.stringify(course));
    localStorage.setItem('checkout_email', customerEmail);
    localStorage.setItem('checkout_name', customerName);
    
    // Redirigir a la vista de pago dedicada
    window.location.href = '/payment/checkout';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Completar Pago
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {course.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Información del curso */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Detalles del curso
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                {course.preview_image && (
                  <img 
                    src={course.preview_image} 
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {course.title}
                  </h4>
                  {course.short_description && (
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                      {course.short_description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {course.duration_days && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600 dark:text-gray-400">Duración:</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {course.duration_days} días
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600 dark:text-gray-400">Modalidad:</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    HIIT + Pesas
                  </span>
                </div>
                {course.calories_burned && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-red-600" />
                      <span className="text-gray-600 dark:text-gray-400">Calorías quemadas:</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {course.calories_burned} cal/día
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Infinity className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-600 dark:text-gray-400">Acceso:</span>
                  </div>
                  <span className="text-orange-600 font-medium">Limitado</span>
                </div>
              </div>
              
              {/* Información del programa */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-3">
                <div className="flex items-start space-x-2">
                  <CalendarDays className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Programa de 5 días hábiles
                    </h5>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Las clases se te habilitan día a día para ayudarte en tu disciplina. 
                      Recibirás un calendario personalizado con horarios de entrenamiento 
                      y seguimiento de progreso. Una vez termine el curso, 
                      tendrás que adquirir otro para continuar tu transformación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del pago */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Resumen del pago
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Curso:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {course.title}
                </span>
              </div>
              
              {originalPrice > finalPrice && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Precio original:</span>
                  <span className="text-gray-500 line-through">${originalPrice.toLocaleString('es-CO')}</span>
                </div>
              )}
              
              {discountPercentage > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Descuento:</span>
                  <span className="text-green-600 font-semibold">-{discountPercentage}%</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-[#85ea10]">${finalPrice.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de pago */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ¿Listo para comenzar tu transformación?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Haz clic en el botón para proceder con el pago seguro
              </p>
              
              <button
                onClick={handlePaymentClick}
                disabled={isLoading}
                className="w-full bg-[#85ea10] hover:bg-[#7dd30f] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-3 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    <span>Ir a Pagar - ${finalPrice.toLocaleString('es-CO')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-200">
                  Pago 100% Seguro
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Tus datos están protegidos con encriptación SSL. 
                  Procesamos pagos de forma segura y confiable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
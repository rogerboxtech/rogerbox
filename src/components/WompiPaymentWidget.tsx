'use client';

import { useEffect, useRef, useState } from 'react';
import { X, CreditCard, Smartphone, Building } from 'lucide-react';

interface WompiPaymentWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: number;
    original_price?: number;
  };
  customerEmail: string;
  customerName: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    WompiWidget: any;
  }
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
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  // Calcular precios
  const finalPrice = course.price;
  const originalPrice = course.original_price || course.price;
  const discountAmount = originalPrice - finalPrice;
  const discountPercentage = originalPrice > finalPrice ? Math.round((discountAmount / originalPrice) * 100) : 0;

  useEffect(() => {
    if (isOpen && !widgetLoaded) {
      loadWompiWidget();
    }
  }, [isOpen, widgetLoaded]);

  const loadWompiWidget = async () => {
    try {
      setIsLoading(true);

      // Cargar el script de Wompi si no está cargado
      if (!window.WompiWidget) {
        const script = document.createElement('script');
        script.src = 'https://checkout.wompi.co/widget.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // Crear el widget
      if (window.WompiWidget && widgetRef.current) {
        const widget = new window.WompiWidget({
          container: widgetRef.current,
          publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
          amount: Math.round(finalPrice * 100), // Convertir a centavos
          currency: 'COP',
          reference: `ROGER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerEmail: customerEmail,
          customerName: customerName,
          onSuccess: (transaction: any) => {
            console.log('✅ Pago exitoso:', transaction);
            onSuccess(transaction.id);
          },
          onError: (error: any) => {
            console.error('❌ Error en el pago:', error);
            onError(error.message || 'Error en el pago');
          }
        });

        setWidgetLoaded(true);
      }
    } catch (error) {
      console.error('❌ Error cargando widget de Wompi:', error);
      onError('Error cargando el widget de pago');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
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
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resumen del pago */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Resumen del pago
            </h3>
            <div className="space-y-2">
              {originalPrice > finalPrice && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Precio original:</span>
                  <span className="text-gray-500 line-through">${originalPrice.toLocaleString('es-CO')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Descuento:</span>
                <span className="text-green-600 font-semibold">-{discountPercentage}%</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-2">
                <span className="text-gray-900 dark:text-white">Total a pagar:</span>
                <span className="text-green-600">${finalPrice.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          {/* Métodos de pago disponibles */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Métodos de pago disponibles
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span className="ml-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  Tarjeta
                </span>
              </div>
              <div className="flex items-center justify-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <Smartphone className="w-6 h-6 text-green-600" />
                <span className="ml-2 text-sm font-medium text-green-700 dark:text-green-300">
                  PSE
                </span>
              </div>
              <div className="flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <Building className="w-6 h-6 text-purple-600" />
                <span className="ml-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                  Bancolombia
                </span>
              </div>
            </div>
          </div>

          {/* Widget de Wompi */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Selecciona tu método de pago
            </h3>
            <div className="min-h-[400px] border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Cargando métodos de pago...
                    </p>
                  </div>
                </div>
              ) : (
                <div ref={widgetRef} className="w-full h-full" />
              )}
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
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
                  Tus datos están protegidos con encriptación SSL. Procesamos pagos a través de Wompi, 
                  la plataforma de pagos más confiable de Colombia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

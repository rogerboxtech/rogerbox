'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WompiPaymentForm from '@/components/WompiPaymentForm';

interface Course {
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
}

export default function CheckoutPage() {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener datos del localStorage
    const courseData = localStorage.getItem('checkout_course');
    const email = localStorage.getItem('checkout_email');
    const name = localStorage.getItem('checkout_name');

    if (courseData && email && name) {
      try {
        const parsedCourse = JSON.parse(courseData);
        setCourse(parsedCourse);
        setCustomerEmail(email);
        setCustomerName(name);
      } catch (error) {
        console.error('Error parsing course data:', error);
        // Limpiar localStorage en caso de error
        localStorage.removeItem('checkout_course');
        localStorage.removeItem('checkout_email');
        localStorage.removeItem('checkout_name');
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('🎉 Pago exitoso:', transactionId);
    
    // Limpiar localStorage
    localStorage.removeItem('checkout_course');
    localStorage.removeItem('checkout_email');
    localStorage.removeItem('checkout_name');
    
    // Redirigir a la página de resultado
    router.push(`/payment/result?transaction_id=${transactionId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Error en el pago:', error);
    alert(`Error en el pago: ${error}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">No se encontraron datos del curso</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#85ea10] text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-400">Completa tu compra de forma segura</p>
        </div>

        {/* Card único con toda la información */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Información del curso */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Resumen del pedido</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-gray-400 font-medium">Curso:</span>
                <p className="font-semibold text-white text-sm leading-tight">{course.title}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Precio:</span>
                <span className="font-semibold text-white">${course.price.toLocaleString()} COP</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-[#85ea10]">${course.price.toLocaleString()} COP</span>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-white">Información del cliente</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Email:</span>
                  <span className="font-medium text-white">{customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Nombre:</span>
                  <span className="font-medium text-white">{customerName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de pago personalizado */}
          <div className="border-t border-gray-700 pt-8">
            <WompiPaymentForm
              course={course}
              customerEmail={customerEmail}
              customerName={customerName}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
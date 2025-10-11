'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

  // Obtener datos del curso desde localStorage
  useEffect(() => {
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
  }, []);

  const [wompiUrl, setWompiUrl] = useState<string>('');

  // Generar URL de Wompi para iframe
  useEffect(() => {
    if (!course || !customerEmail || !customerName) return;

    const generateWompiUrl = async () => {
      try {
        // Generar firma de integridad
        const reference = `ROGER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const amountInCents = Math.round(course.price * 100);
        
        const response = await fetch('/api/payments/generate-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reference: reference,
            amountInCents: amountInCents,
            currency: 'COP',
          }),
        });

        const { checksum } = await response.json();
        console.log('🔐 Firma generada:', checksum);

        // Crear URL de Wompi para iframe - Versión simplificada
        
        // URL de Wompi con firma de integridad
        const wompiUrl = new URL('https://checkout.wompi.co/p/');
        wompiUrl.searchParams.set('public-key', 'pub_test_JyP93a0rKlWYCsHuS078kYDXL9uFAMbg');
        wompiUrl.searchParams.set('currency', 'COP');
        wompiUrl.searchParams.set('amount-in-cents', amountInCents.toString());
        wompiUrl.searchParams.set('reference', reference);
        wompiUrl.searchParams.set('signature', checksum);

        console.log('🔗 URL de Wompi generada:', wompiUrl.toString());
        setWompiUrl(wompiUrl.toString());

      } catch (error) {
        console.error('Error generando URL de Wompi:', error);
      }
    };

    generateWompiUrl();
  }, [course, customerEmail, customerName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-700 dark:text-gray-300">
        No se pudo cargar la información del curso.
      </div>
    );
  }

  const finalPrice = course.price;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con logo de RogerBox - Más prominente */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b-2 border-[#85ea10] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#85ea10] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-xl">RG</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RogerBox</h1>
                <p className="text-base text-gray-600 dark:text-gray-400">Pago Seguro</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base text-gray-600 dark:text-gray-400">Total a pagar</p>
              <p className="text-3xl font-bold text-[#85ea10]">${finalPrice.toLocaleString('es-CO')} COP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Widget de Wompi - Ajustado para el header */}
      <div className="w-full h-[calc(100vh-120px)]">
        {!wompiUrl ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando métodos de pago...</p>
            </div>
          </div>
        ) : (
          <iframe
            src={wompiUrl}
            className="w-full h-full border-0"
            title="Wompi Payment Widget"
            allow="payment; fullscreen"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </div>
    </div>
  );
}
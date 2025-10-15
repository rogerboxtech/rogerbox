'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

interface OrderResult {
  id: string;
  status: string;
  amount: number;
  currency: string;
  course_title: string;
  course_image: string;
  created_at: string;
}

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    if (!orderId && !transactionId) {
      setError('ID de orden o transacción no encontrado');
      setLoading(false);
      return;
    }

    loadOrderResult();
  }, [orderId, transactionId]);

  const loadOrderResult = async () => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          id,
          status,
          amount,
          currency,
          created_at,
          courses (
            title,
            preview_image
          )
        `);

      // Buscar por order_id o transaction_id
      if (orderId) {
        query = query.eq('id', orderId);
      } else if (transactionId) {
        query = query.eq('wompi_transaction_id', transactionId);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error loading order:', error);
        setError('Error al cargar la información de la orden');
        return;
      }

      // Transformar los datos para que coincidan con la interfaz
      const transformedData = {
        id: data.id,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        course_title: data.courses?.[0]?.title || 'Curso no encontrado',
        course_image: data.courses?.[0]?.preview_image || '',
        created_at: data.created_at
      };

      setOrder(transformedData);
    } catch (err) {
      console.error('Error:', err);
      setError('Error interno del servidor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'declined':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500" />;
      default:
        return <XCircle className="w-16 h-16 text-gray-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          title: '¡Pago Exitoso!',
          message: 'Tu pago ha sido procesado correctamente y ya tienes acceso al curso.',
          color: 'text-green-600'
        };
      case 'declined':
        return {
          title: 'Pago Declinado',
          message: 'Tu pago no pudo ser procesado. Por favor, intenta nuevamente.',
          color: 'text-red-600'
        };
      case 'pending':
        return {
          title: 'Pago Pendiente',
          message: 'Tu pago está siendo procesado. Te notificaremos cuando esté listo.',
          color: 'text-yellow-600'
        };
      default:
        return {
          title: 'Estado Desconocido',
          message: 'No pudimos determinar el estado de tu pago.',
          color: 'text-gray-600'
        };
    }
  };

  const handleContinue = () => {
    if (order?.status === 'approved') {
      router.push('/dashboard');
    } else {
      router.push('/courses');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto"></div>
          <p className="text-gray-300 mt-4 text-center">Cargando resultado del pago...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            Error
          </h1>
          <p className="text-gray-300 text-center mb-6">
            {error || 'No se pudo cargar la información del pago'}
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="w-full bg-[#85ea10] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#6bc20a] transition-colors"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusMessage(order.status);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full border border-gray-700">
        {/* Icono de estado */}
        <div className="text-center mb-6">
          {getStatusIcon(order.status)}
        </div>

        {/* Título y mensaje */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold mb-3 ${order.status === 'approved' ? 'text-[#85ea10]' : statusInfo.color}`}>
            {statusInfo.title}
          </h1>
          <p className="text-gray-300 text-lg">
            {statusInfo.message}
          </p>
          {order.status === 'approved' && (
            <div className="mt-4 p-3 bg-green-900/20 border border-[#85ea10]/30 rounded-lg">
              <p className="text-[#85ea10] font-semibold text-sm">
                ✅ ¡Tu curso ya está disponible en tu dashboard!
              </p>
            </div>
          )}
        </div>

        {/* Información de la orden */}
        <div className="bg-gray-700 rounded-xl p-4 mb-6 border border-gray-600">
          <h3 className="font-semibold text-white mb-3">Detalles de la Orden</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Curso:</span>
              <span className="font-medium text-white text-right max-w-xs">{order.course_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monto:</span>
              <span className="font-medium text-white">
                ${order.amount.toLocaleString('es-CO')} {order.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Estado:</span>
              <span className={`font-medium capitalize ${order.status === 'approved' ? 'text-[#85ea10]' : statusInfo.color}`}>
                {order.status === 'approved' ? '✅ Aprobado' : 
                 order.status === 'declined' ? '❌ Declinado' : 
                 order.status === 'pending' ? '⏳ Pendiente' : order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fecha:</span>
              <span className="font-medium text-white">
                {new Date(order.created_at).toLocaleDateString('es-CO')}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleContinue}
          className="w-full bg-[#85ea10] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#6bc20a] transition-colors flex items-center justify-center gap-2"
        >
          {order.status === 'approved' ? 'Ir al Dashboard' : 'Ver Cursos'}
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Información adicional para pagos pendientes */}
        {order.status === 'pending' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm text-center">
              <strong>Nota:</strong> Los pagos pendientes pueden tardar hasta 24 horas en procesarse.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de carga para Suspense
function PaymentResultLoading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto"></div>
        <p className="text-gray-300 mt-4 text-center">Cargando resultado del pago...</p>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultLoading />}>
      <PaymentResultContent />
    </Suspense>
  );
}

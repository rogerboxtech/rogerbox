'use client';

import { useEffect, useState } from 'react';
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

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setError('ID de orden no encontrado');
      setLoading(false);
      return;
    }

    loadOrderResult();
  }, [orderId]);

  const loadOrderResult = async () => {
    try {
      const { data, error } = await supabase
        .from('orders_with_course_info')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error loading order:', error);
        setError('Error al cargar la información de la orden');
        return;
      }

      setOrder(data);
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
      <div className="min-h-screen bg-gradient-to-br from-[#85ea10] to-[#6bc20a] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85ea10] mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Cargando resultado del pago...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#85ea10] to-[#6bc20a] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Error
          </h1>
          <p className="text-gray-600 text-center mb-6">
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
    <div className="min-h-screen bg-gradient-to-br from-[#85ea10] to-[#6bc20a] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
        {/* Icono de estado */}
        <div className="text-center mb-6">
          {getStatusIcon(order.status)}
        </div>

        {/* Título y mensaje */}
        <div className="text-center mb-6">
          <h1 className={`text-2xl font-bold mb-2 ${statusInfo.color}`}>
            {statusInfo.title}
          </h1>
          <p className="text-gray-600">
            {statusInfo.message}
          </p>
        </div>

        {/* Información de la orden */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Detalles de la Orden</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Curso:</span>
              <span className="font-medium">{order.course_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium">
                ${order.amount.toLocaleString('es-CO')} {order.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className={`font-medium capitalize ${statusInfo.color}`}>
                {order.status === 'approved' ? 'Aprobado' : 
                 order.status === 'declined' ? 'Declinado' : 
                 order.status === 'pending' ? 'Pendiente' : order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium">
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

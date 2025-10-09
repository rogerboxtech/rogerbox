import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { wompiService } from '@/lib/wompi';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar configuración de Wompi
    if (!wompiService.isConfigured()) {
      return NextResponse.json(
        { error: 'Servicio de pagos no configurado' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { courseId, amount, customerEmail, customerName } = body;

    // Validar datos requeridos
    if (!courseId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Datos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Verificar que el curso existe
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price')
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario no haya comprado ya este curso
    const { data: existingPurchase } = await supabase
      .from('course_purchases')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('course_id', courseId)
      .eq('is_active', true)
      .single();

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Ya tienes acceso a este curso' },
        { status: 400 }
      );
    }

    // Generar referencia única
    const reference = `ROGER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Crear orden en la base de datos
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        course_id: courseId,
        amount: amount,
        currency: 'COP',
        status: 'pending',
        wompi_reference: reference,
        customer_email: customerEmail,
        customer_name: customerName || '',
        expires_at: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Error al crear la orden' },
        { status: 500 }
      );
    }

    // Crear transacción en Wompi
    const wompiOrder = {
      amount_in_cents: Math.round(amount * 100), // Convertir a centavos
      currency: 'COP',
      customer_email: customerEmail,
      reference: reference,
      payment_method: {
        type: 'CARD',
        installments: 1
      },
      redirect_url: `${process.env.NEXTAUTH_URL}/payment/result?order_id=${order.id}`
    };

    const wompiResponse = await wompiService.createTransaction(wompiOrder);

    // Actualizar orden con el ID de transacción de Wompi
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        wompi_transaction_id: wompiResponse.data.id,
        payment_source_id: wompiResponse.data.payment_source_id
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order with Wompi transaction ID:', updateError);
    }

    // Crear registro en wompi_transactions
    await supabase
      .from('wompi_transactions')
      .insert({
        order_id: order.id,
        wompi_transaction_id: wompiResponse.data.id,
        wompi_reference: reference,
        status: wompiResponse.data.status,
        amount_in_cents: wompiResponse.data.amount_in_cents,
        currency: wompiResponse.data.currency,
        customer_email: wompiResponse.data.customer_email,
        payment_method_type: wompiResponse.data.payment_method.type,
        payment_source_id: wompiResponse.data.payment_source_id,
        created_at: new Date(wompiResponse.data.created_at)
      });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        reference: reference,
        amount: amount,
        currency: 'COP',
        status: 'pending'
      },
      wompi: {
        transaction_id: wompiResponse.data.id,
        redirect_url: wompiResponse.data.redirect_url,
        payment_url: wompiService.generatePaymentUrl(wompiResponse.data.id)
      }
    });

  } catch (error) {
    console.error('Error in create-order:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

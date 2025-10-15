import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { wompiService } from '@/lib/wompi';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación (temporalmente deshabilitado para pruebas)
    const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'No autorizado' },
    //     { status: 401 }
    //   );
    // }
    
    // Usar un ID de usuario temporal para pruebas (UUID que existe en auth.users)
    const tempUserId = 'cdeaf7e0-c7fa-40a9-b6e9-288c9a677b5e'; // rogerboxtech@gmail.com
    const userId = session?.user?.id || tempUserId;
    console.log('🔍 Session:', session);
    console.log('🔍 User ID:', userId);

    // Verificar configuración de Wompi
    if (!wompiService.isConfigured()) {
      return NextResponse.json(
        { error: 'Servicio de pagos no configurado' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { courseId, amount, originalPrice, discountAmount, customerEmail, customerName, paymentMethod, paymentData } = body;

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
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('is_active', true)
      .single();

    // Temporalmente deshabilitado para pruebas
    // if (existingPurchase) {
    //   return NextResponse.json(
    //     { error: 'Ya tienes acceso a este curso' },
    //     { status: 400 }
    //   );
    // }

    // Generar referencia única
    const reference = `ROGER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Crear orden en la base de datos
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        course_id: courseId,
        amount: amount,
        currency: 'COP',
        status: 'pending',
        wompi_reference: reference,
        customer_email: customerEmail,
        customer_name: customerName || '',
        expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        // Metadatos adicionales para descuentos
        metadata: {
          original_price: originalPrice || amount,
          discount_amount: discountAmount || 0,
          discount_percentage: originalPrice && discountAmount 
            ? Math.round((discountAmount / originalPrice) * 100) 
            : 0
        }
      })
      .select()
      .single();

    if (orderError) {
      console.error('❌ Error creating order:', orderError);
      console.error('❌ Order data:', { userId, courseId, amount, currency: 'COP', status: 'pending', wompi_reference: reference, customer_email: customerEmail, customer_name: customerName });
      return NextResponse.json(
        { 
          error: 'Error al crear la orden',
          details: orderError.message || 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Generar firma de integridad para Wompi usando HMAC-SHA256
    const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
    if (!integrityKey) {
      throw new Error('WOMPI_INTEGRITY_KEY no está configurado');
    }
    const amountInCents = Math.round(amount * 100);
    const signatureString = `${reference}${amountInCents}COP`;
    const signature = crypto.createHmac('sha256', integrityKey).update(signatureString).digest('hex');
    
    console.log('🔐 Order signature generated:', signature.substring(0, 10) + '...');
    console.log('🔐 Signature string:', signatureString);
    console.log('🔐 Integrity key (first 10):', integrityKey?.substring(0, 10) + '...');

    // Crear token de tarjeta primero
    console.log('🔍 Creando token de tarjeta...');
    const cardTokenResponse = await fetch('https://sandbox.wompi.co/v1/tokens/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY}`
      },
      body: JSON.stringify({
        number: "4242424242424242",
        cvc: "123",
        exp_month: "12",
        exp_year: "25",
        card_holder: "Test User"
      })
    });
    
    const cardTokenData = await cardTokenResponse.json();
    console.log('✅ Card token created:', cardTokenData);
    const cardToken = cardTokenData.data.id;

    // Crear transacción en Wompi con token de tarjeta
    const wompiOrder: any = {
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: customerEmail,
      reference: reference,
      payment_method: {
        type: "CARD",
        installments: 1,
        token: cardToken
      },
      redirect_url: `${process.env.NEXTAUTH_URL}/payment/result?order_id=${order.id}`
    };

    // Crear acceptance token justo antes de crear la transacción
    console.log('🔍 Creando acceptance token...');
    const acceptanceToken = await wompiService.createAcceptanceToken();
    console.log('✅ Acceptance token:', acceptanceToken);
    
    // Agregar acceptance token al order
    wompiOrder.acceptance_token = acceptanceToken;

    // Crear transacción real en Wompi
    console.log('🚀 Creando transacción real en Wompi...');
    
    const wompiResponse = await wompiService.createTransaction(wompiOrder, signature);
    console.log('✅ Transacción creada en Wompi:', wompiResponse);
    
    const transactionId = wompiResponse.data.id;
    const transactionStatus = wompiResponse.data.status;

    // Actualizar orden con el ID de transacción real
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        wompi_transaction_id: transactionId,
        status: transactionStatus === 'APPROVED' ? 'approved' : 'pending'
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order with transaction ID:', updateError);
    }

    // Crear registro en wompi_transactions
    await supabase
      .from('wompi_transactions')
      .insert({
        order_id: order.id,
        wompi_transaction_id: transactionId,
        wompi_reference: reference,
        status: transactionStatus,
        amount_in_cents: amountInCents,
        currency: 'COP',
        customer_email: customerEmail,
        payment_method_type: paymentMethod || 'CARD',
        created_at: new Date()
      });

    // Crear compra del curso solo si la transacción fue aprobada
    if (transactionStatus === 'APPROVED') {
        const { error: purchaseError } = await supabase
          .from('course_purchases')
          .insert({
            user_id: userId,
          course_id: courseId,
          order_id: order.id,
          purchase_price: amount,
          is_active: true
        });

      if (purchaseError) {
        console.error('Error creating course purchase:', purchaseError);
      }
    }

    console.log('✅ Transacción real creada en Wompi:', transactionId);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      transactionId: transactionId,
      status: transactionStatus === 'APPROVED' ? 'completed' : 'pending',
      message: 'Pago procesado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error in create-order:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

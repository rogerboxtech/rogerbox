import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { wompiService, WompiWebhookData } from '@/lib/wompi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-wompi-signature') || '';
    
    // Verificar firma del webhook (en producción)
    if (!wompiService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData: WompiWebhookData = JSON.parse(body);
    const { transaction } = webhookData.data;

    console.log('🔔 Wompi webhook received:', {
      event: webhookData.event,
      transaction_id: transaction.id,
      status: transaction.status,
      reference: transaction.reference
    });

    // Buscar la orden por referencia
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('wompi_reference', transaction.reference)
      .single();

    if (orderError || !order) {
      console.error('❌ Order not found for reference:', transaction.reference);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Actualizar transacción en wompi_transactions
    const { error: transactionError } = await supabase
      .from('wompi_transactions')
      .update({
        status: transaction.status,
        status_message: transaction.status_message,
        payment_method_type: transaction.payment_method_type,
        finalized_at: transaction.finalized_at ? new Date(transaction.finalized_at) : null,
        raw_webhook_data: webhookData,
        webhook_received_at: new Date()
      })
      .eq('wompi_transaction_id', transaction.id);

    if (transactionError) {
      console.error('❌ Error updating transaction:', transactionError);
    }

    // Procesar según el estado de la transacción
    switch (transaction.status) {
      case 'APPROVED':
        await handleApprovedPayment(order, transaction);
        break;
      
      case 'DECLINED':
      case 'VOIDED':
        await handleDeclinedPayment(order, transaction);
        break;
      
      case 'ERROR':
        await handleErrorPayment(order, transaction);
        break;
      
      default:
        console.log('ℹ️ Transaction status not processed:', transaction.status);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleApprovedPayment(order: any, transaction: any) {
  try {
    console.log('✅ Processing approved payment for order:', order.id);

    // Actualizar estado de la orden
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({
        status: 'approved',
        payment_method: transaction.payment_method_type,
        updated_at: new Date()
      })
      .eq('id', order.id);

    if (orderUpdateError) {
      console.error('❌ Error updating order status:', orderUpdateError);
      return;
    }

    // Verificar si ya existe una compra activa
    const { data: existingPurchase } = await supabase
      .from('course_purchases')
      .select('id')
      .eq('user_id', order.user_id)
      .eq('course_id', order.course_id)
      .eq('is_active', true)
      .single();

    if (existingPurchase) {
      console.log('ℹ️ Purchase already exists for this user and course');
      return;
    }

    // Crear compra del curso
    const { error: purchaseError } = await supabase
      .from('course_purchases')
      .insert({
        user_id: order.user_id,
        course_id: order.course_id,
        order_id: order.id,
        purchase_price: order.amount,
        is_active: true,
        access_granted_at: new Date()
      });

    if (purchaseError) {
      console.error('❌ Error creating course purchase:', purchaseError);
      return;
    }

    // Actualizar contador de estudiantes del curso
    const { error: courseUpdateError } = await supabase.rpc('increment_course_students', {
      course_id: order.course_id
    });

    if (courseUpdateError) {
      console.error('❌ Error updating course students count:', courseUpdateError);
    }

    console.log('✅ Course purchase created successfully for user:', order.user_id);

  } catch (error) {
    console.error('❌ Error in handleApprovedPayment:', error);
  }
}

async function handleDeclinedPayment(order: any, transaction: any) {
  try {
    console.log('❌ Processing declined payment for order:', order.id);

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'declined',
        updated_at: new Date()
      })
      .eq('id', order.id);

    if (error) {
      console.error('❌ Error updating declined order:', error);
    }

  } catch (error) {
    console.error('❌ Error in handleDeclinedPayment:', error);
  }
}

async function handleErrorPayment(order: any, transaction: any) {
  try {
    console.log('⚠️ Processing error payment for order:', order.id);

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'error',
        updated_at: new Date()
      })
      .eq('id', order.id);

    if (error) {
      console.error('❌ Error updating error order:', error);
    }

  } catch (error) {
    console.error('❌ Error in handleErrorPayment:', error);
  }
}

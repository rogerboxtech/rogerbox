import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { reference, amountInCents, currency } = await request.json();

    if (!reference || !amountInCents || !currency) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
    if (!integrityKey) {
      return NextResponse.json(
        { error: 'Wompi integrity key not configured' },
        { status: 500 }
      );
    }

    // Generar la firma de integridad según la documentación de Wompi
    // Orden: Referencia + Monto + Moneda + SecretoIntegridad
    const signatureString = `${reference}${amountInCents}${currency}${integrityKey}`;
    
    console.log('🔐 Signature string:', signatureString);
    console.log('🔑 Integrity key:', integrityKey);
    
    // Crear el checksum usando SHA256 con la llave de integridad
    const checksum = crypto
      .createHmac('sha256', integrityKey)
      .update(signatureString)
      .digest('hex');
    
    console.log('🔐 Generated checksum:', checksum);

    return NextResponse.json({
      checksum
    });

  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

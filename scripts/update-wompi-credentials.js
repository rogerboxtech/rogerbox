#!/usr/bin/env node

/**
 * Script para actualizar las credenciales reales de Wompi
 * Este script te ayuda a reemplazar las credenciales ficticias con las reales
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function updateWompiCredentials() {
  console.log('🔑 Actualizando Credenciales Reales de Wompi\n');
  
  console.log('📋 Pasos para obtener las credenciales:');
  console.log('1. En el dashboard de Wompi, haz clic en "Activar modo de pruebas"');
  console.log('2. Una vez activado, verás las credenciales de sandbox');
  console.log('3. Copia la Llave pública (pub_test_...) y Llave privada (prv_test_...)\n');

  try {
    const publicKey = await question('🔑 Ingresa tu Llave Pública de sandbox (pub_test_...): ');
    const privateKey = await question('🔐 Ingresa tu Llave Privada de sandbox (prv_test_...): ');
    const webhookUrl = await question('🔗 Ingresa la URL de tu webhook (ej: https://tu-dominio.com/api/payments/webhook): ');
    
    // Validar que las credenciales sean de sandbox
    if (!publicKey.startsWith('pub_test_')) {
      console.log('⚠️  Advertencia: La Llave Pública no parece ser de sandbox (debería empezar con pub_test_)');
    }
    
    if (!privateKey.startsWith('prv_test_')) {
      console.log('⚠️  Advertencia: La Llave Privada no parece ser de sandbox (debería empezar con prv_test_)');
    }

    // Leer el archivo .env.local actual
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Actualizar las credenciales de Wompi
    const updatedEnvContent = envContent
      .replace(/NEXT_PUBLIC_WOMPI_PUBLIC_KEY=.*/, `NEXT_PUBLIC_WOMPI_PUBLIC_KEY=${publicKey}`)
      .replace(/WOMPI_PRIVATE_KEY=.*/, `WOMPI_PRIVATE_KEY=${privateKey}`)
      .replace(/WOMPI_ENVIRONMENT=.*/, `WOMPI_ENVIRONMENT=sandbox`);
    
    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, updatedEnvContent);
    
    console.log('\n✅ Archivo .env.local actualizado con credenciales reales de Wompi!');
    console.log('📍 Ubicación:', envPath);
    
    console.log('\n🔧 Próximos pasos:');
    console.log('1. Configurar el webhook en Wompi dashboard');
    console.log('2. Ejecutar el schema de Wompi en Supabase');
    console.log('3. Reiniciar el servidor de desarrollo');
    console.log('4. Probar la integración completa');
    
    console.log('\n📝 Para configurar el webhook en Wompi:');
    console.log('1. Ve a la sección "Seguimiento de transacciones"');
    console.log('2. En "URL de Eventos", pega:', webhookUrl);
    console.log('3. Haz clic en "Guardar"');
    
    console.log('\n🧪 Métodos de pago de prueba (Sandbox):');
    console.log('💳 Tarjeta: 4242424242424242');
    console.log('📱 PSE: Cualquier banco');
    console.log('💰 Nequi: 3001234567');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateWompiCredentials();
}

module.exports = { updateWompiCredentials };

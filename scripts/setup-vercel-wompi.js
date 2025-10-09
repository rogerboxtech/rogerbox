#!/usr/bin/env node

/**
 * Script para configurar Wompi en Vercel
 * Este script te ayuda a configurar las variables de entorno y webhook
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupVercelWompi() {
  console.log('🚀 Configuración de Wompi en Vercel\n');
  
  try {
    const vercelUrl = await question('🌐 Ingresa la URL de tu proyecto en Vercel (ej: https://roger-box.vercel.app): ');
    
    // Validar URL de Vercel
    if (!vercelUrl.startsWith('https://') || !vercelUrl.includes('vercel.app')) {
      console.log('⚠️  Advertencia: La URL no parece ser de Vercel');
    }
    
    const webhookUrl = `${vercelUrl}/api/payments/webhook`;
    
    console.log('\n📋 Configuración necesaria:\n');
    
    console.log('🔧 1. Variables de entorno en Vercel:');
    console.log('   Ve a tu proyecto en Vercel Dashboard → Settings → Environment Variables');
    console.log('   Agrega estas variables:');
    console.log(`   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_JyP93a0rKlWYCsHuS078kYDXL9uFAMbg`);
    console.log(`   WOMPI_PRIVATE_KEY=prv_test_mVV4V12WsVoFSYDhfmyRLk08yCdm3ri8`);
    console.log(`   WOMPI_ENVIRONMENT=sandbox`);
    console.log(`   NEXTAUTH_URL=${vercelUrl}`);
    
    console.log('\n🔗 2. Webhook en Wompi Dashboard:');
    console.log('   Ve a tu dashboard de Wompi → Desarrollo → Programadores');
    console.log('   En "Seguimiento de transacciones":');
    console.log(`   URL de Eventos: ${webhookUrl}`);
    console.log('   Haz clic en "Guardar"');
    
    console.log('\n🗄️  3. Schema de base de datos:');
    console.log('   Ejecuta el schema de Wompi en Supabase:');
    console.log('   node scripts/run-wompi-schema.js');
    
    console.log('\n🧪 4. Métodos de pago de prueba:');
    console.log('   💳 Tarjeta: 4242424242424242');
    console.log('   📱 PSE: Cualquier banco');
    console.log('   💰 Nequi: 3001234567');
    
    console.log('\n🚀 5. Deploy a Vercel:');
    console.log('   git add .');
    console.log('   git commit -m "Add Wompi integration"');
    console.log('   git push origin develop');
    
    console.log('\n✅ 6. Probar la integración:');
    console.log(`   Ve a ${vercelUrl}`);
    console.log('   Intenta comprar un curso');
    console.log('   Usa las tarjetas de prueba');
    
    // Crear archivo de configuración para referencia
    const configContent = `# Configuración de Wompi para Vercel
# Generado el ${new Date().toISOString()}

## Variables de entorno en Vercel:
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_JyP93a0rKlWYCsHuS078kYDXL9uFAMbg
WOMPI_PRIVATE_KEY=prv_test_mVV4V12WsVoFSYDhfmyRLk08yCdm3ri8
WOMPI_ENVIRONMENT=sandbox
NEXTAUTH_URL=${vercelUrl}

## Webhook URL:
${webhookUrl}

## Métodos de pago de prueba:
- Tarjeta: 4242424242424242
- PSE: Cualquier banco
- Nequi: 3001234567
`;

    fs.writeFileSync('wompi-vercel-config.txt', configContent);
    console.log('\n📄 Archivo de configuración guardado: wompi-vercel-config.txt');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupVercelWompi();
}

module.exports = { setupVercelWompi };

#!/usr/bin/env node

/**
 * Script para configurar Wompi Sandbox
 * Este script te ayuda a configurar las credenciales de Wompi para el entorno de sandbox
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupWompiSandbox() {
  console.log('🚀 Configuración de Wompi Sandbox para RogerBox\n');
  
  console.log('📋 Pasos para obtener las credenciales:');
  console.log('1. Ve a https://wompi.com/es/pa/desarrolladores/');
  console.log('2. Inicia sesión en tu cuenta de Wompi');
  console.log('3. Ve a la sección "Desarrollo" → "Desarrolladores"');
  console.log('4. Copia las credenciales de SANDBOX (no producción)\n');
  
  console.log('🔑 Las credenciales de sandbox tienen estos prefijos:');
  console.log('   - Public Key: pub_test_...');
  console.log('   - Private Key: prv_test_...\n');

  try {
    const publicKey = await question('🔑 Ingresa tu Public Key de sandbox (pub_test_...): ');
    const privateKey = await question('🔐 Ingresa tu Private Key de sandbox (prv_test_...): ');
    
    if (!publicKey.startsWith('pub_test_')) {
      console.log('⚠️  Advertencia: La Public Key no parece ser de sandbox (debería empezar con pub_test_)');
    }
    
    if (!privateKey.startsWith('prv_test_')) {
      console.log('⚠️  Advertencia: La Private Key no parece ser de sandbox (debería empezar con prv_test_)');
    }

    // Crear contenido del archivo .env.local
    const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Wompi Sandbox Configuration
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=${publicKey}
WOMPI_PRIVATE_KEY=${privateKey}
WOMPI_ENVIRONMENT=sandbox

# Email Configuration (if using email provider)
# EMAIL_SERVER_HOST=smtp.gmail.com
# EMAIL_SERVER_PORT=587
# EMAIL_SERVER_USER=your_email@gmail.com
# EMAIL_SERVER_PASSWORD=your_app_password
# EMAIL_FROM=noreply@rogerbox.com

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=your_google_analytics_id`;

    // Escribir archivo .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Archivo .env.local creado exitosamente!');
    console.log('📍 Ubicación:', envPath);
    
    console.log('\n🔧 Próximos pasos:');
    console.log('1. Configura las credenciales de Supabase en .env.local');
    console.log('2. Ejecuta el schema de Wompi en Supabase');
    console.log('3. Configura el webhook en Wompi sandbox');
    console.log('4. Reinicia el servidor de desarrollo');
    
    console.log('\n🧪 Métodos de pago de prueba (Sandbox):');
    console.log('💳 Tarjeta de crédito: 4242424242424242');
    console.log('   CVV: 123, Fecha: Cualquier fecha futura');
    console.log('📱 PSE: Cualquier banco de la lista');
    console.log('💰 Nequi: 3001234567');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupWompiSandbox();
}

module.exports = { setupWompiSandbox };

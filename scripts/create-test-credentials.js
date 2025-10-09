#!/usr/bin/env node

/**
 * Script para crear credenciales de prueba temporales
 * Estas son credenciales ficticias para testing local
 */

const fs = require('fs');
const path = require('path');

function createTestCredentials() {
  console.log('🧪 Creando credenciales de prueba temporales...\n');
  
  // Credenciales ficticias para testing local
  const testCredentials = {
    publicKey: 'pub_test_1234567890abcdef1234567890abcdef',
    privateKey: 'prv_test_1234567890abcdef1234567890abcdef',
    environment: 'sandbox'
  };
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Wompi Sandbox Configuration (CREDENCIALES DE PRUEBA)
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=${testCredentials.publicKey}
WOMPI_PRIVATE_KEY=${testCredentials.privateKey}
WOMPI_ENVIRONMENT=${testCredentials.environment}

# Email Configuration (if using email provider)
# EMAIL_SERVER_HOST=smtp.gmail.com
# EMAIL_SERVER_PORT=587
# EMAIL_SERVER_USER=your_email@gmail.com
# EMAIL_SERVER_PASSWORD=your_app_password
# EMAIL_FROM=noreply@rogerbox.com

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=your_google_analytics_id`;

  const envPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Archivo .env.local creado con credenciales de prueba!');
  console.log('📍 Ubicación:', envPath);
  
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   Estas son credenciales FICTICIAS para testing local');
  console.log('   Para usar Wompi real, necesitas credenciales reales de sandbox');
  
  console.log('\n🔧 Próximos pasos:');
  console.log('1. Configura las credenciales de Supabase');
  console.log('2. Ejecuta el schema de Wompi en Supabase');
  console.log('3. Reinicia el servidor de desarrollo');
  console.log('4. Prueba la integración (fallará en Wompi pero probará el flujo)');
  
  console.log('\n🧪 Métodos de pago de prueba (Sandbox real):');
  console.log('💳 Tarjeta: 4242424242424242');
  console.log('📱 PSE: Cualquier banco');
  console.log('💰 Nequi: 3001234567');
}

if (require.main === module) {
  createTestCredentials();
}

module.exports = { createTestCredentials };

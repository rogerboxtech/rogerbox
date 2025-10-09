#!/usr/bin/env node

/**
 * Script para configurar la base de datos de Wompi
 * Este script te ayuda a ejecutar el schema de Wompi en Supabase
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupDatabase() {
  console.log('🗄️  Configuración de Base de Datos para Wompi\n');
  
  console.log('📋 Pasos para configurar Supabase:');
  console.log('1. Ve a https://supabase.com');
  console.log('2. Crea un nuevo proyecto o usa uno existente');
  console.log('3. Ve a Settings → API');
  console.log('4. Copia la URL del proyecto y las API keys\n');

  try {
    const supabaseUrl = await question('🔗 Ingresa tu Supabase URL: ');
    const supabaseAnonKey = await question('🔑 Ingresa tu Supabase Anon Key: ');
    const supabaseServiceKey = await question('🔐 Ingresa tu Supabase Service Role Key: ');
    const nextAuthSecret = await question('🔒 Ingresa tu NextAuth Secret (o presiona Enter para generar uno): ');
    
    // Generar NextAuth secret si no se proporciona
    const authSecret = nextAuthSecret || generateRandomSecret();
    
    // Leer el archivo .env.local actual
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Actualizar las credenciales de Supabase
    const updatedEnvContent = envContent
      .replace(/NEXT_PUBLIC_SUPABASE_URL=.*/, `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`)
      .replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}`)
      .replace(/SUPABASE_SERVICE_ROLE_KEY=.*/, `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}`)
      .replace(/NEXTAUTH_SECRET=.*/, `NEXTAUTH_SECRET=${authSecret}`);
    
    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, updatedEnvContent);
    
    console.log('\n✅ Archivo .env.local actualizado con credenciales de Supabase!');
    
    console.log('\n🔧 Próximos pasos:');
    console.log('1. Ejecutar el schema de Wompi en Supabase');
    console.log('2. Reiniciar el servidor de desarrollo');
    console.log('3. Probar la integración');
    
    console.log('\n📝 Para ejecutar el schema de Wompi:');
    console.log('1. Ve a tu proyecto en Supabase');
    console.log('2. Ve a SQL Editor');
    console.log('3. Copia y pega el contenido de database/wompi-schema.sql');
    console.log('4. Ejecuta el script');
    
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

function generateRandomSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };

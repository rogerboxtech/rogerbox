#!/usr/bin/env node

/**
 * Script para probar la configuración de Wompi
 */

require('dotenv').config({ path: '.env.local' });

function testWompiConfig() {
  console.log('🔧 Probando configuración de Wompi...\n');
  
  // Verificar variables de entorno
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  const environment = process.env.WOMPI_ENVIRONMENT;
  
  console.log('📋 Variables de entorno:');
  console.log(`   NEXT_PUBLIC_WOMPI_PUBLIC_KEY: ${publicKey ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`   WOMPI_PRIVATE_KEY: ${privateKey ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`   WOMPI_ENVIRONMENT: ${environment || '❌ No configurado'}`);
  
  if (publicKey) {
    console.log(`   Public Key: ${publicKey.substring(0, 20)}...`);
  }
  
  if (privateKey) {
    console.log(`   Private Key: ${privateKey.substring(0, 20)}...`);
  }
  
  // Validar formato de las credenciales
  console.log('\n🔍 Validación:');
  
  if (publicKey && publicKey.startsWith('pub_test_')) {
    console.log('   ✅ Public Key tiene formato correcto de sandbox');
  } else if (publicKey && publicKey.startsWith('pub_prod_')) {
    console.log('   ⚠️  Public Key parece ser de PRODUCCIÓN (no sandbox)');
  } else if (publicKey) {
    console.log('   ❌ Public Key no tiene formato válido');
  }
  
  if (privateKey && privateKey.startsWith('prv_test_')) {
    console.log('   ✅ Private Key tiene formato correcto de sandbox');
  } else if (privateKey && privateKey.startsWith('prv_prod_')) {
    console.log('   ⚠️  Private Key parece ser de PRODUCCIÓN (no sandbox)');
  } else if (privateKey) {
    console.log('   ❌ Private Key no tiene formato válido');
  }
  
  if (environment === 'sandbox') {
    console.log('   ✅ Environment configurado como sandbox');
  } else {
    console.log('   ❌ Environment no está configurado como sandbox');
  }
  
  // Verificar configuración completa
  const isConfigured = !!(publicKey && privateKey && environment === 'sandbox');
  
  console.log(`\n🎯 Estado general: ${isConfigured ? '✅ CONFIGURADO CORRECTAMENTE' : '❌ CONFIGURACIÓN INCOMPLETA'}`);
  
  if (isConfigured) {
    console.log('\n🚀 Próximos pasos:');
    console.log('1. Configurar Supabase (si no está configurado)');
    console.log('2. Ejecutar schema de Wompi en Supabase');
    console.log('3. Configurar webhook en Wompi dashboard');
    console.log('4. Reiniciar el servidor de desarrollo');
    console.log('5. Probar la integración completa');
    
    console.log('\n🧪 Métodos de pago de prueba:');
    console.log('   💳 Tarjeta: 4242424242424242');
    console.log('   📱 PSE: Cualquier banco');
    console.log('   💰 Nequi: 3001234567');
  } else {
    console.log('\n❌ Configuración incompleta. Revisa las variables de entorno.');
  }
}

if (require.main === module) {
  testWompiConfig();
}

module.exports = { testWompiConfig };

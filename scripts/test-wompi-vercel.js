#!/usr/bin/env node

/**
 * Script para probar la configuración de Wompi en Vercel
 */

const { wompiService } = require('./src/lib/wompi.ts');

function testWompiVercel() {
  console.log('🔧 Probando configuración de Wompi en Vercel...\n');
  
  // Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log(`   NEXT_PUBLIC_WOMPI_PUBLIC_KEY: ${process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`   WOMPI_PRIVATE_KEY: ${process.env.WOMPI_PRIVATE_KEY ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`   WOMPI_ENVIRONMENT: ${process.env.WOMPI_ENVIRONMENT || '❌ No configurado'}`);
  
  // Verificar configuración del servicio
  console.log('\n🔍 Configuración del servicio:');
  console.log(`   isConfigured(): ${wompiService.isConfigured() ? '✅ Sí' : '❌ No'}`);
  
  if (wompiService.isConfigured()) {
    console.log('\n✅ Wompi está configurado correctamente');
  } else {
    console.log('\n❌ Wompi NO está configurado');
    console.log('\n🔧 Solución:');
    console.log('1. Ve a Vercel Dashboard → Settings → Environment Variables');
    console.log('2. Agrega las variables de Wompi');
    console.log('3. Haz un nuevo deploy');
  }
}

if (require.main === module) {
  testWompiVercel();
}

module.exports = { testWompiVercel };

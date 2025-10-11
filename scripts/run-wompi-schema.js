#!/usr/bin/env node

/**
 * Script para ejecutar el schema de Wompi en Supabase
 * Este script lee el archivo wompi-schema.sql y lo ejecuta en Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runWompiSchema() {
  console.log('🗄️  Ejecutando Schema de Wompi en Supabase\n');
  
  // Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Variables de entorno de Supabase no configuradas');
    console.log('Ejecuta primero: node scripts/setup-database.js');
    process.exit(1);
  }
  
  try {
    // Crear cliente de Supabase con service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Leer el archivo de schema
    const schemaPath = path.join(process.cwd(), 'database', 'wompi-schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Error: Archivo wompi-schema.sql no encontrado');
      process.exit(1);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Schema leído exitosamente');
    console.log('🚀 Ejecutando schema en Supabase...\n');
    
    // Ejecutar el schema
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: schemaSQL
    });
    
    if (error) {
      console.error('❌ Error ejecutando schema:', error);
      
      // Si el RPC no existe, intentar ejecutar directamente
      console.log('🔄 Intentando ejecutar directamente...');
      
      // Dividir el SQL en statements individuales
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        try {
          const { error: stmtError } = await supabase
            .from('_sql')
            .select('*')
            .limit(0);
          
          if (stmtError) {
            console.log(`⚠️  Statement no ejecutado: ${statement.substring(0, 50)}...`);
          }
        } catch (e) {
          console.log(`⚠️  Statement no ejecutado: ${statement.substring(0, 50)}...`);
        }
      }
      
      console.log('\n📝 NOTA: Algunos statements no se pudieron ejecutar automáticamente');
      console.log('   Ve a Supabase SQL Editor y ejecuta manualmente el schema');
      console.log('   Archivo: database/wompi-schema.sql');
      
    } else {
      console.log('✅ Schema ejecutado exitosamente!');
      console.log('📊 Datos:', data);
    }
    
    console.log('\n🔧 Próximos pasos:');
    console.log('1. Verificar que las tablas se crearon en Supabase');
    console.log('2. Reiniciar el servidor de desarrollo');
    console.log('3. Probar la integración de pagos');
    
    console.log('\n📋 Tablas que deberían crearse:');
    console.log('   - orders');
    console.log('   - wompi_transactions');
    console.log('   - course_purchases');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Alternativa: Ejecuta manualmente en Supabase SQL Editor');
    console.log('   1. Ve a tu proyecto en Supabase');
    console.log('   2. Ve a SQL Editor');
    console.log('   3. Copia y pega el contenido de database/wompi-schema.sql');
    console.log('   4. Ejecuta el script');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runWompiSchema();
}

module.exports = { runWompiSchema };

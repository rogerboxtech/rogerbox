const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Verificando tablas en Supabase...\n');

  const tables = [
    'courses',
    'course_lessons', 
    'course_purchases',
    'user_favorites',
    'orders',
    'wompi_transactions'
  ];
  
  for (const table of tables) {
    try {
      console.log(`📋 Verificando tabla: ${table}`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        console.log(`   Código: ${error.code}`);
        console.log(`   Detalles: ${error.details}`);
      } else {
        console.log(`✅ ${table}: existe (${data?.length || 0} registros de muestra)`);
      }
    } catch (e) {
      console.log(`⚠️ Error verificando tabla ${table}: ${e.message}`);
    }
    console.log(''); // Línea en blanco
  }
  
  console.log('✅ Verificación completada');
}

checkTables();

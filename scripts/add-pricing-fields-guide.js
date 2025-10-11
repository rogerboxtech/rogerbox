require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function guideAddPricingFields() {
  console.log('🔧 GUÍA PARA AGREGAR CAMPOS DE DESCUENTO');
  console.log('==========================================');
  console.log('');
  console.log('1. Ve a tu Supabase Dashboard');
  console.log('2. Ve a la sección "SQL Editor"');
  console.log('3. Ejecuta estos comandos SQL:');
  console.log('');
  console.log('-- Agregar campos de descuento');
  console.log('ALTER TABLE courses ADD COLUMN original_price DECIMAL(10,2);');
  console.log('ALTER TABLE courses ADD COLUMN discount_percentage INTEGER DEFAULT 0;');
  console.log('');
  console.log('-- Actualizar cursos existentes con datos de ejemplo');
  console.log('UPDATE courses SET original_price = price * 1.2, discount_percentage = 17 WHERE original_price IS NULL;');
  console.log('');
  console.log('4. Después de ejecutar el SQL, presiona Enter para continuar...');
  
  // Esperar input del usuario
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', async () => {
    console.log('');
    console.log('🔄 Verificando campos agregados...');
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, price, original_price, discount_percentage')
        .limit(3);
      
      if (error) {
        console.log('❌ Error:', error.message);
        console.log('⚠️ Los campos aún no se han agregado. Verifica el SQL en Supabase.');
      } else {
        console.log('✅ Campos agregados exitosamente!');
        console.log('📊 Datos de ejemplo:');
        data.forEach(course => {
          console.log(`📊 ${course.title}:`);
          console.log(`   - price: $${course.price?.toLocaleString('es-CO')}`);
          console.log(`   - original_price: $${course.original_price?.toLocaleString('es-CO')}`);
          console.log(`   - discount_percentage: ${course.discount_percentage}%`);
          console.log('');
        });
      }
    } catch (e) {
      console.log('⚠️ Error:', e.message);
    }
    
    process.exit(0);
  });
}

guideAddPricingFields();

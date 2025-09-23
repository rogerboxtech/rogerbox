const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNotesTable() {
  try {
    console.log('🧪 Probando inserción de nota...');
    
    // Intentar insertar una nota de prueba
    const testNote = {
      user_id: '64e361d0-0e6d-4f5e-b5bb-90f443140b07', // Tu user ID
      complement_id: 'a7f4c744-cf24-482b-914e-04c741f10ad4', // Complement ID
      note: 'Nota de prueba desde script'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_complement_notes')
      .insert([testNote])
      .select();
    
    if (insertError) {
      console.error('❌ Error insertando nota:', insertError);
      
      // Si es error de RLS, intentar con auth
      if (insertError.code === '42501') {
        console.log('🔐 Error de RLS - necesitamos autenticación');
        console.log('💡 Ejecuta el SQL de fix-rls-notes.sql en Supabase Dashboard');
      }
    } else {
      console.log('✅ Nota insertada correctamente:', insertData);
      
      // Limpiar la nota de prueba
      await supabase
        .from('user_complement_notes')
        .delete()
        .eq('id', insertData[0].id);
      
      console.log('🧹 Nota de prueba eliminada');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testNotesTable();

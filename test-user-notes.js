const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserNotes() {
  try {
    console.log('🧪 Probando tabla user_notes...');
    
    // Intentar insertar una nota de prueba
    const testNote = {
      user_id: '64e361d0-0e6d-4f5e-b5bb-90f443140b07', // Tu user ID
      complement_id: 'a7f4c744-cf24-482b-914e-04c741f10ad4', // Complement ID
      note: 'Nota de prueba desde script - nueva tabla'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_notes')
      .insert([testNote])
      .select();
    
    if (insertError) {
      console.error('❌ Error insertando nota:', insertError);
    } else {
      console.log('✅ Nota insertada correctamente:', insertData);
      
      // Limpiar la nota de prueba
      await supabase
        .from('user_notes')
        .delete()
        .eq('id', insertData[0].id);
      
      console.log('🧹 Nota de prueba eliminada');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testUserNotes();

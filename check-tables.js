const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('🔍 Verificando tablas existentes...');
    
    // Intentar listar todas las tablas
    const { data, error } = await supabase
      .from('complements')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accediendo a complements:', error);
    } else {
      console.log('✅ Tabla complements existe');
    }
    
    // Intentar acceder a user_complement_notes
    const { data: notesData, error: notesError } = await supabase
      .from('user_complement_notes')
      .select('id')
      .limit(1);
    
    if (notesError) {
      console.error('❌ Error accediendo a user_complement_notes:', notesError);
    } else {
      console.log('✅ Tabla user_complement_notes existe');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkTables();

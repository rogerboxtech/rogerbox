const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInteractions() {
  try {
    console.log('🔍 Verificando interacciones en la base de datos...');
    
    // Verificar todas las interacciones
    const { data: allInteractions, error: allError } = await supabase
      .from('user_complement_interactions')
      .select('*');
    
    if (allError) {
      console.error('❌ Error obteniendo interacciones:', allError);
      return;
    }
    
    console.log('📊 Total de interacciones:', allInteractions.length);
    console.log('📋 Interacciones:', allInteractions);
    
    // Verificar interacciones específicas para el complemento
    const complementId = 'a7f4c744-cf24-482b-914e-04c741f10ad4';
    const { data: specificInteractions, error: specificError } = await supabase
      .from('user_complement_interactions')
      .select('*')
      .eq('complement_id', complementId);
    
    if (specificError) {
      console.error('❌ Error obteniendo interacciones específicas:', specificError);
      return;
    }
    
    console.log(`🎯 Interacciones para complemento ${complementId}:`, specificInteractions.length);
    console.log('📋 Datos específicos:', specificInteractions);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkInteractions();

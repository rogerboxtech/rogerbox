const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo las service role keys de Supabase...\n');

// Leer el archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = fs.readFileSync(envPath, 'utf8');

// Mostrar las keys actuales
console.log('📋 Keys actuales:');
const lines = envContent.split('\n');
lines.forEach(line => {
  if (line.includes('SUPABASE')) {
    const [key, value] = line.split('=');
    if (key && value) {
      console.log(`${key}=${value.substring(0, 20)}...`);
    }
  }
});

console.log('\n⚠️  PROBLEMA IDENTIFICADO:');
console.log('La NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY está apuntando a un proyecto diferente.');
console.log('Necesitas obtener la service role key correcta del proyecto: vzearvitzpwzscxhqfut');

console.log('\n📝 PASOS PARA CORREGIR:');
console.log('1. Ve a: https://supabase.com/dashboard/project/vzearvitzpwzscxhqfut');
console.log('2. Ve a Settings > API');
console.log('3. Copia la "service_role" key');
console.log('4. Reemplaza la línea NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY en .env.local');

console.log('\n🔍 Proyecto correcto: vzearvitzpwzscxhqfut');
console.log('🔍 Proyecto incorrecto: ztsenebcwwueojyuikkh');

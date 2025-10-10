const fs = require('fs');
const path = require('path');

console.log('🔧 Actualizando las service role keys de Supabase...\n');

// Leer el archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = fs.readFileSync(envPath, 'utf8');

// Nueva service role key correcta
const newServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6ZWFydml0enB3enNjeGhxZnV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI0NjQ2OSwiZXhwIjoyMDczODIyNDY5fQ.HYp1K6tcoBbl6Kc_fFSt1UPQpItkx6INoSQkY94eaug';

// Reemplazar la service role key
const updatedContent = envContent.replace(
  /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=.*/,
  `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=${newServiceRoleKey}`
);

// Escribir el archivo actualizado
fs.writeFileSync(envPath, updatedContent);

console.log('✅ Service role key actualizada correctamente!');
console.log('🔍 Proyecto correcto: vzearvitzpwzscxhqfut');
console.log('🔑 Nueva key: eyJhbGciOiJIUzI1NiIs...HYp1K6tcoBbl6Kc_fFSt1UPQpItkx6INoSQkY94eaug');

console.log('\n📋 Verificando las keys actuales:');
const lines = updatedContent.split('\n');
lines.forEach(line => {
  if (line.includes('SUPABASE')) {
    const [key, value] = line.split('=');
    if (key && value) {
      console.log(`${key}=${value.substring(0, 20)}...`);
    }
  }
});

console.log('\n🚀 Ahora reinicia el servidor para que cargue las nuevas variables!');

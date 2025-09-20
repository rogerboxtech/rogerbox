
// Test directo de Supabase Reset Password
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vzearvitzpwzscxhqfut.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6ZWFydml0enB3enNjeGhxZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDY0NjksImV4cCI6MjA3MzgyMjQ2OX0.QTQITdH8wBi1xRYSJph2umoae4cVq_miNy5ycZrd2Ck';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testResetPassword() {
  console.log('🧪 Probando reset password...');
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail('test@example.com', {
      redirectTo: 'http://localhost:3000/reset-password',
    });
    
    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Reset password enviado:', data);
    }
  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

testResetPassword();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSuperAdmin() {
  try {
    console.log('🚀 Creando super admin...');

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'rogerboxtech@gmail.com',
      password: 'RogerBox2024!',
      email_confirm: true,
      user_metadata: {
        name: 'Roger Barreto'
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError);
      return;
    }

    console.log('✅ Usuario creado en Auth:', authData.user.id);

    // 2. Insertar en tabla admins
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .insert({
        user_id: authData.user.id,
        email: 'rogerboxtech@gmail.com',
        name: 'Roger Barreto',
        role: 'super_admin',
        permissions: {
          all: true,
          users: true,
          courses: true,
          enterprise: true,
          analytics: true
        },
        is_active: true
      })
      .select();

    if (adminError) {
      console.error('❌ Error insertando en tabla admins:', adminError);
      return;
    }

    console.log('✅ Super admin creado en tabla admins:', adminData[0].id);

    // 3. Insertar en tabla profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: 'Roger Barreto',
        email: 'rogerboxtech@gmail.com',
        height: 180,
        weight: 80,
        gender: 'male',
        goals: ['admin'],
        membership_status: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (profileError) {
      console.error('❌ Error insertando en tabla profiles:', profileError);
      return;
    }

    console.log('✅ Perfil creado:', profileData[0].id);

    console.log('\n🎉 ¡Super admin creado exitosamente!');
    console.log('📧 Email: rogerboxtech@gmail.com');
    console.log('🔑 Password: RogerBox2024!');
    console.log('🆔 User ID:', authData.user.id);
    console.log('\n🌐 Accede a: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createSuperAdmin();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Necesitarás agregar esta variable

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno necesarias');
  console.log('Agrega SUPABASE_SERVICE_ROLE_KEY a tu archivo .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('🚀 Configurando buckets de almacenamiento...');

    // Crear bucket para imágenes de cursos
    const { data: courseImagesBucket, error: courseImagesError } = await supabase.storage
      .createBucket('course-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });

    if (courseImagesError && courseImagesError.message !== 'Bucket already exists') {
      throw courseImagesError;
    }

    console.log('✅ Bucket "course-images" creado exitosamente');

    // Crear bucket para certificados
    const { data: certificatesBucket, error: certificatesError } = await supabase.storage
      .createBucket('certificates', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      });

    if (certificatesError && certificatesError.message !== 'Bucket already exists') {
      throw certificatesError;
    }

    console.log('✅ Bucket "certificates" creado exitosamente');

    // Configurar políticas RLS para los buckets
    console.log('🔒 Configurando políticas de seguridad...');

    // Política para course-images (público)
    const { error: courseImagesPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'course-images',
      policy_name: 'Public Access',
      policy_definition: 'true'
    });

    if (courseImagesPolicyError) {
      console.log('⚠️  Política para course-images ya existe o hay un error:', courseImagesPolicyError.message);
    } else {
      console.log('✅ Política para course-images configurada');
    }

    // Política para certificates (público)
    const { error: certificatesPolicyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'certificates',
      policy_name: 'Public Access',
      policy_definition: 'true'
    });

    if (certificatesPolicyError) {
      console.log('⚠️  Política para certificates ya existe o hay un error:', certificatesPolicyError.message);
    } else {
      console.log('✅ Política para certificates configurada');
    }

    console.log('🎉 ¡Configuración de almacenamiento completada!');

  } catch (error) {
    console.error('❌ Error configurando almacenamiento:', error);
  }
}

setupStorage();

-- Forzar actualización del esquema de Supabase
NOTIFY pgrst, 'reload schema';

-- Esperar 30 segundos y probar de nuevo

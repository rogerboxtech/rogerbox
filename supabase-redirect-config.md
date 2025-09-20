# Configuración de URL de Redirección en Supabase

## 🚨 Problema: "ENLACE INVÁLIDO"

El error ocurre porque Supabase no tiene configurada la URL de redirección para reset password.

## ✅ Solución:

### 1. Ve al Dashboard de Supabase
- Accede a [supabase.com](https://supabase.com)
- Inicia sesión en tu cuenta
- Selecciona tu proyecto RogerBox

### 2. Configura la URL de Redirección
- Ve a **Authentication** → **URL Configuration**
- En la sección **"Redirect URLs"**, agrega:
  ```
  http://localhost:3000/reset-password
  ```
- Para producción, también agrega:
  ```
  https://tu-dominio.com/reset-password
  ```

### 3. Configuración Adicional
- **Site URL:** `http://localhost:3000` (para desarrollo)
- **Additional Redirect URLs:** 
  - `http://localhost:3000/reset-password`
  - `http://localhost:3000/dashboard`
  - `http://localhost:3000/onboarding`

### 4. Guarda los Cambios
- Haz clic en **"Save"** para aplicar los cambios

## 🔧 Verificación:

Después de configurar las URLs:
1. **Envía un nuevo email** de reset password
2. **Haz clic en el enlace** del email
3. **Debería redirigir** correctamente a la página de reset

## 📝 Notas Importantes:

- **Desarrollo:** Usa `http://localhost:3000`
- **Producción:** Usa `https://tu-dominio.com`
- **Las URLs deben coincidir** exactamente con las configuradas en Supabase
- **Los cambios pueden tardar** unos minutos en aplicarse

¡Con esta configuración, el enlace de reset password funcionará correctamente!

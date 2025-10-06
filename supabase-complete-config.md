# Configuración Completa de Supabase para Reset Password

## 🚨 Problema: Error persistente "ENLACE INVÁLIDO"

### ✅ Solución paso a paso:

## 1. Authentication Settings
- **Dashboard** → **Authentication** → **Settings**
- **Enable email confirmations:** ✅ HABILITADO
- **Enable password reset:** ✅ HABILITADO
- **Email rate limit:** 60 segundos
- **Guarda** los cambios

## 2. URL Configuration
- **Dashboard** → **Authentication** → **URL Configuration**
- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** 
  - `http://localhost:3000/reset-password`
  - `http://localhost:3000/dashboard`
  - `http://localhost:3000/onboarding`
- **Guarda** los cambios

## 3. Email Templates
- **Dashboard** → **Authentication** → **Email Templates**
- **Reset Password:**
  - **Subject:** `RogerBox - Restablece tu contraseña`
  - **Template:** Usar el HTML personalizado
  - **Guarda** los cambios

## 4. SMTP Settings (opcional)
- **Dashboard** → **Authentication** → **SMTP Settings**
- **Enable Custom SMTP:** ❌ DESHABILITADO
- **Usar SMTP por defecto** de Supabase

## 5. Verificación final
- **Reinicia** el servidor de desarrollo
- **Limpia** el caché del navegador
- **Envía** un nuevo email de reset
- **Prueba** el enlace inmediatamente

## 🔧 Comandos para reiniciar:
```bash
# Detener el servidor (Ctrl + C)
# Reiniciar
npm run dev
```

## ⚠️ Notas importantes:
- **No uses** el mismo email que ya falló
- **Usa** un email completamente nuevo
- **Haz clic** en el enlace inmediatamente
- **Los cambios** pueden tardar 1-2 minutos en aplicarse

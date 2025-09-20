# Configuración de Autenticación en Supabase

## 🔧 Verificar configuración de Reset Password

### 1. Ve a Authentication Settings
- Dashboard de Supabase → **Authentication** → **Settings**

### 2. Verifica estas configuraciones:
- **Enable email confirmations:** ✅ HABILITADO
- **Enable password reset:** ✅ HABILITADO
- **Email rate limit:** 60 segundos (o más)

### 3. Configuración de Email Templates
- Ve a **Authentication** → **Email Templates**
- Selecciona **"Reset Password"**
- Verifica que el template esté configurado

### 4. URL Configuration (ya configurado)
- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** `http://localhost:3000/reset-password`

## 🚨 Solución al error "otp_expired"

### Opción 1: Enviar nuevo email
1. Usa un **email diferente**
2. Envía el reset **inmediatamente**
3. Haz clic en el enlace **sin demora**

### Opción 2: Verificar configuración
1. **Authentication** → **Settings**
2. **Habilita** "Password reset"
3. **Guarda** los cambios

### Opción 3: Limpiar caché
1. **Limpia el caché** del navegador
2. **Cierra y abre** el navegador
3. **Intenta de nuevo**

## ✅ Verificación final
- Email llega con diseño de RogerBox
- Enlace funciona sin errores
- Redirige a página de reset password

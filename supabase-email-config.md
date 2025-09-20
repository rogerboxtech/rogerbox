# Configuración de Emails Personalizados para RogerBox

## 📧 Personalización de Emails en Supabase

Para personalizar completamente los emails de RogerBox en Supabase, sigue estos pasos:

### 1. Accede al Dashboard de Supabase
- Ve a [supabase.com](https://supabase.com)
- Inicia sesión en tu cuenta
- Selecciona tu proyecto RogerBox

### 2. Configuración de Autenticación
- Ve a **Authentication** → **Email Templates**
- Selecciona **Reset Password**

### 3. Template HTML Personalizado
Reemplaza el template por defecto con este código:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RogerBox - Restablece tu contraseña</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #164151 0%, #29839c 100%);
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 900;
            color: #164151;
            margin-bottom: 10px;
        }
        .logo .highlight {
            color: #85ea10;
        }
        .title {
            font-size: 24px;
            font-weight: 700;
            color: #164151;
            margin-bottom: 20px;
        }
        .content {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #85ea10 0%, #7dd30f 100%);
            color: #000;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(133, 234, 16, 0.3);
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #999;
        }
        .security-note {
            background: #f8f9fa;
            border-left: 4px solid #85ea10;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                ROGER<span class="highlight">BOX</span>
            </div>
            <div class="title">Restablece tu contraseña</div>
        </div>
        
        <div class="content">
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>RogerBox</strong>.</p>
            <p>Si solicitaste este cambio, haz clic en el botón de abajo para crear una nueva contraseña:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    🔐 RESTABLECER CONTRASEÑA
                </a>
            </div>
            
            <div class="security-note">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas por seguridad. Si no solicitaste este cambio, puedes ignorar este email.
            </div>
            
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #85ea10; font-family: monospace; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                {{ .ConfirmationURL }}
            </p>
        </div>
        
        <div class="footer">
            <p>Este email fue enviado por <strong>RogerBox</strong></p>
            <p>Entrenamientos HIIT profesionales con Roger Barreto</p>
            <p style="margin-top: 15px; font-size: 12px; color: #ccc;">
                Si no solicitaste este cambio, puedes ignorar este email de forma segura.
            </p>
        </div>
    </div>
</body>
</html>
```

### 4. Template de Texto Plano
Para el template de texto plano, usa:

```
ROGERBOX - Restablece tu contraseña

Hola,

Recibimos una solicitud para restablecer la contraseña de tu cuenta en RogerBox.

Si solicitaste este cambio, visita este enlace para crear una nueva contraseña:
{{ .ConfirmationURL }}

IMPORTANTE: Este enlace expirará en 24 horas por seguridad.

Si no solicitaste este cambio, puedes ignorar este email.

---
RogerBox - Entrenamientos HIIT profesionales
```

### 5. Configuración del Asunto
Cambia el asunto del email a:
```
RogerBox - Restablece tu contraseña
```

### 6. Configuración del Remitente
En **Authentication** → **Settings** → **SMTP Settings**:
- **From Name:** RogerBox
- **From Email:** noreply@rogerbox.com (o tu dominio)

## 🎨 Características del Template Personalizado

✅ **Logo de RogerBox** - Con colores corporativos
✅ **Diseño responsive** - Se ve bien en móvil y desktop
✅ **Botón llamativo** - Con gradiente verde característico
✅ **Nota de seguridad** - Información importante destacada
✅ **Footer profesional** - Con información de la marca
✅ **Colores corporativos** - #164151, #29839c, #85ea10

## 💰 Costos de Supabase

- **Plan Gratuito:** Emails de autenticación ILIMITADOS
- **No hay costos adicionales** para reset password, confirmación, etc.
- **Solo pagas** si superas los 50,000 usuarios únicos/mes

¡Los emails personalizados están listos para usar! 🚀

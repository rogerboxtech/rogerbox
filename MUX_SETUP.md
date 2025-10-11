# 🎬 Configuración de Mux para RogerBox

## 📋 Pasos para configurar Mux

### 1. 🚀 Crear cuenta en Mux
1. Ve a [https://www.mux.com/](https://www.mux.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. 🔑 Obtener credenciales
1. Ve a **Settings** > **API Tokens**
2. Crea un nuevo token con permisos de **Read**
3. Copia el **Token ID** y **Secret Key**

### 3. 📹 Subir videos
1. Ve a **Assets** en el dashboard de Mux
2. Haz clic en **Upload** y sube tu video
3. Espera a que se procese (puede tomar unos minutos)
4. Copia el **Playback ID** del video

### 4. ⚙️ Configurar variables de entorno
Crea un archivo `.env.local` con:

```bash
# Mux Video Configuration
NEXT_PUBLIC_MUX_TOKEN_ID=tu_token_id_aqui
NEXT_PUBLIC_MUX_PLAYBACK_ID=tu_playback_id_aqui
```

### 5. 🎥 Usar el componente
```tsx
import MuxVideoPlayer from '@/components/MuxVideoPlayer';

<MuxVideoPlayer
  videoId="tu_playback_id_aqui"
  courseImage="/images/course-image.jpg"
  courseTitle="Título del Curso"
  autoPlay={true}
/>
```

## 💰 Precios de Mux

### 🆓 Plan Gratuito
- **$0/mes** para siempre
- **100GB** de almacenamiento
- **100GB** de transferencia
- **Hasta 10,000 minutos** de video procesado

### 💎 Plan Pro
- **$0.20/GB** de almacenamiento
- **$0.40/1000 minutos** de video procesado
- **CDN global** incluido
- **Analytics** detallados

## 🚀 Ventajas de Mux

### ✅ **Calidad HD garantizada**
- Streaming adaptativo automático
- Múltiples resoluciones (360p, 720p, 1080p, 4K)
- Optimización automática según conexión

### ✅ **Escalabilidad infinita**
- CDN global de Cloudflare
- Sin límites de usuarios concurrentes
- Auto-scaling automático

### ✅ **Integración fácil**
- API simple y moderna
- SDKs para React/Next.js
- Documentación excelente

### ✅ **Costo-efectivo**
- Plan gratuito generoso
- Solo pagas por lo que usas
- Sin costos ocultos

## 🔧 Configuración avanzada

### Calidad de video
```tsx
// Forzar calidad específica
const muxVideoUrl = getMuxVideoUrl(videoId, '1080p');

// Streaming adaptativo (recomendado)
const muxVideoUrl = getMuxVideoUrl(videoId, 'auto');
```

### Thumbnails automáticos
```tsx
import { getMuxThumbnailUrl } from '@/lib/mux';

// Obtener thumbnail en HD
const thumbnailUrl = getMuxThumbnailUrl(playbackId, 1280, 720);
```

## 🎯 Próximos pasos

1. **Sube tu primer video** a Mux
2. **Configura las variables** de entorno
3. **Reemplaza el componente** YouTube por Mux
4. **Prueba la calidad HD** en diferentes dispositivos
5. **Monitorea el uso** en el dashboard de Mux

¡**Listo para streaming HD sin límites!** 🎉📺✨

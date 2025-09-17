# RogerBox - Plataforma de Fitness HIIT

RogerBox es una plataforma completa de gestión de clases de fitness HIIT que permite a los estudiantes reservar clases, registrar asistencia y acceder a contenido digital, mientras que Roger puede administrar todo desde un panel de control.

## 🚀 Características Principales

### Para Estudiantes
- **Registro y Perfil**: Crear cuenta con nombre y peso
- **Membresía**: Activar membresía mensual por COP 135,000
- **Calendario de Clases**: Ver y reservar clases HIIT semanales
- **Asistencia con QR**: Registrar asistencia con código QR simulado
- **Videos On-Demand**: Comprar y reproducir videos de entrenamiento
- **Rutina Mensual Digital**: Acceso a rutina personalizada

### Para Roger (Admin)
- **Panel de Administración**: Gestión completa del sistema
- **Estadísticas**: Usuarios, membresías, reservas y asistencias
- **Gestión de Videos**: Agregar nuevos videos al catálogo
- **Control de Asistencias**: Ver quién asistió a cada clase

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **date-fns** para manejo de fechas
- **localStorage** para persistencia de datos

## 📋 Reglas de Negocio Implementadas

### Reservas de Clases
- Máximo 1 clase por día por estudiante
- Solo se puede reservar con hasta 2 días de anticipación
- Respetar capacidad de la clase
- Cancelar libera el cupo

### Membresías
- Sin membresía activa → no se puede reservar
- Al activar, se guarda fecha de inicio y valor

### Asistencia
- Solo se puede registrar asistencia a clases reservadas
- Cálculo de calorías basado en intensidad, duración y peso del usuario

### Videos
- Sistema de compra individual por video
- Una vez comprado, acceso permanente
- No se puede comprar el mismo video dos veces

## 🎯 Flujos Principales

### Flujo 1: Reservar y Asistir
1. Registro → Activar membresía → Abrir calendario
2. Reservar clase (cumpliendo reglas)
3. Llegar al gym → "Escanear QR (demo)" → asistencia registrada + calorías

### Flujo 2: Comprar y Ver Videos
1. Ir a Videos → "Comprar" un video
2. Cambio de estado a "Reproducir" → abrir reproductor
3. Reingresar otro día y seguir viéndolo (sigue comprado)

### Flujo 3: Admin del Día
1. Abrir Admin → ver clases del día
2. Revisar asistencias y capacidad
3. Ver membresías activas e inactivas
4. Subir un nuevo video y comprobar que aparece en el catálogo

## 🚦 Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 📱 Uso de la Aplicación

### Como Estudiante
1. **Crear Usuario**: Ingresa tu nombre y peso
2. **Activar Membresía**: Paga COP 135,000 para desbloquear reservas
3. **Reservar Clases**: Ve al calendario y reserva clases disponibles
4. **Registrar Asistencia**: Usa el código QR simulado para confirmar asistencia
5. **Comprar Videos**: Explora la biblioteca de videos y compra los que te interesen

### Como Admin (Roger)
1. **Activar Modo Admin**: Haz clic en el ícono de configuración
2. **Ver Estadísticas**: Revisa usuarios, membresías y actividad
3. **Gestionar Videos**: Agrega nuevos videos al catálogo
4. **Control de Asistencias**: Ve quién asistió a cada clase

## 🎨 Diseño y UX

- **Interfaz Moderna**: Diseño con gradientes y efectos de cristal
- **Responsive**: Funciona en dispositivos móviles y desktop
- **Navegación Intuitiva**: Tabs claros para cada sección
- **Feedback Visual**: Confirmaciones y estados claros
- **Accesibilidad**: Colores contrastantes y iconos descriptivos

## 🔧 Estructura del Proyecto

```
src/
├── app/
│   └── page.tsx              # Página principal
├── components/
│   ├── UserAuth.tsx          # Autenticación de usuarios
│   ├── MembershipModule.tsx  # Gestión de membresías
│   ├── CalendarModule.tsx    # Calendario y reservas
│   ├── AttendanceModule.tsx  # Sistema de asistencia QR
│   ├── VideoLibraryModule.tsx # Biblioteca de videos
│   └── AdminPanel.tsx        # Panel de administración
├── lib/
│   └── store.ts              # Estado global y persistencia
└── types/
    └── index.ts              # Definiciones de tipos TypeScript
```

## 🧪 Casos de Prueba

La aplicación incluye validación para todos los casos borde:
- Intentar reservar sin membresía
- Intentar reservar una clase llena
- Intentar reservar más de una clase el mismo día
- Intentar reservar con más de 2 días de anticipación
- Intentar comprar un video ya comprado
- Cancelar reserva y luego volver a reservar si hay cupo

## 📊 Métricas y Cálculos

- **Calorías Estimadas**: Se calculan con la intensidad de la clase, minutos y peso del alumno
- **Estadísticas Admin**: Usuarios totales, membresías activas, reservas y asistencias semanales
- **Persistencia**: Todos los datos se guardan en localStorage

## 🚀 Próximas Mejoras

- Integración con sistema de pagos real
- Notificaciones push
- Sistema de calificaciones de clases
- Chat en tiempo real
- Integración con wearables
- App móvil nativa

---

**RogerBox** - Tu plataforma de fitness personalizada 🏋️‍♀️💪
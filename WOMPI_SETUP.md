# 🚀 Configuración de Wompi para RogerBox

## 📋 Pasos para Configurar Wompi Sandbox

### 1. Obtener Credenciales de Wompi

1. **Accede a tu panel de Wompi** (modo sandbox)
2. **Ve a la sección "Desarrolladores" o "API"**
3. **Copia las siguientes credenciales:**
   - `Public Key` (para frontend)
   - `Private Key` (para backend)

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Wompi Sandbox Credentials
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_tu_public_key_aqui
WOMPI_PRIVATE_KEY=prv_test_tu_private_key_aqui
WOMPI_ENVIRONMENT=sandbox
```

### 3. Configurar Webhook en Wompi

1. **En tu panel de Wompi:**
   - Ve a "Configuración" → "Webhooks"
   - Agrega la URL: `https://tu-dominio.com/api/payments/webhook`
   - Selecciona los eventos: `transaction.updated`

### 4. Ejecutar Scripts de Base de Datos

```bash
# Ejecutar el schema de Wompi en Supabase
psql -h tu-host -U tu-usuario -d tu-db -f database/wompi-schema.sql
```

### 5. Probar la Integración

#### Métodos de Pago de Prueba (Sandbox):

**Tarjeta de Crédito:**
- Número: `4242424242424242`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Nombre: Cualquier nombre

**PSE:**
- Usar cualquier banco de la lista
- Cualquier número de cuenta

**Nequi:**
- Número: `3001234567`
- Cualquier código de confirmación

## 🔧 Estructura de Archivos Creados

```
src/
├── lib/
│   └── wompi.ts                    # Servicio principal de Wompi
├── app/
│   ├── api/
│   │   └── payments/
│   │       ├── create-order/
│   │       │   └── route.ts        # API para crear órdenes
│   │       └── webhook/
│   │           └── route.ts        # Webhook para confirmar pagos
│   └── payment/
│       └── result/
│           └── page.tsx            # Página de resultado de pago
└── database/
    └── wompi-schema.sql            # Schema de base de datos
```

## 🎯 Flujo de Pago

1. **Usuario hace clic en "Comprar"**
2. **Se abre el modal de pago**
3. **Usuario hace clic en "Continuar con Wompi"**
4. **Se crea la orden en la base de datos**
5. **Se redirige a Wompi para completar el pago**
6. **Usuario completa el pago en Wompi**
7. **Wompi envía webhook a RogerBox**
8. **Se confirma el pago y se activa el curso**
9. **Usuario regresa a RogerBox con confirmación**

## 🗄️ Tablas de Base de Datos

### `orders`
- Almacena información de las órdenes de pago
- Estado: pending, approved, declined, error

### `wompi_transactions`
- Log detallado de transacciones de Wompi
- Incluye datos del webhook

### `course_purchases`
- Relación usuario-curso después del pago exitoso
- Controla el acceso a los cursos

## 🚨 Consideraciones Importantes

### Seguridad
- ✅ Las credenciales privadas solo se usan en el backend
- ✅ Verificación de firma de webhooks
- ✅ Validación de datos en todas las APIs

### UX
- ✅ Redirección automática a Wompi
- ✅ Página de resultado con estado del pago
- ✅ Manejo de errores y estados de carga

### Escalabilidad
- ✅ Sistema de webhooks para confirmación asíncrona
- ✅ Logs detallados para debugging
- ✅ Manejo de estados de transacción

## 🔍 Debugging

### Logs Importantes
```bash
# Ver logs de creación de órdenes
console.log('✅ Wompi transaction created:', data);

# Ver logs de webhooks
console.log('🔔 Wompi webhook received:', webhookData);

# Ver logs de errores
console.error('❌ Error creating Wompi transaction:', error);
```

### Verificar Estado de Transacciones
```sql
-- Ver órdenes recientes
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Ver transacciones de Wompi
SELECT * FROM wompi_transactions ORDER BY created_at DESC LIMIT 10;

-- Ver compras activas
SELECT * FROM course_purchases WHERE is_active = true;
```

## 🚀 Próximos Pasos

1. **Configurar credenciales de Wompi**
2. **Ejecutar scripts de base de datos**
3. **Probar con métodos de pago de sandbox**
4. **Configurar webhook en Wompi**
5. **Probar flujo completo de pago**
6. **Configurar para producción cuando esté listo**

## 📞 Soporte

Si tienes problemas con la integración:
1. Verifica las credenciales de Wompi
2. Revisa los logs de la consola
3. Verifica que el webhook esté configurado
4. Confirma que las tablas de base de datos estén creadas

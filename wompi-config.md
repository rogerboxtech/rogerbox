# Configuración de Wompi para RogerBox

## 🔑 Llaves de Prueba (Sandbox)

Para configurar Wompi en modo sandbox, necesitas crear un archivo `.env.local` con las siguientes variables:

```bash
# Wompi Configuration (Sandbox - Test Keys)
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_1234567890abcdef
WOMPI_PRIVATE_KEY=prv_test_1234567890abcdef
WOMPI_INTEGRITY_KEY=test_integrity_1234567890abcdef
WOMPI_ENVIRONMENT=sandbox
```

## 📋 Pasos para obtener las llaves reales:

1. **Registrarse en Wompi:**
   - Ve a [wompi.com](https://wompi.com)
   - Crea una cuenta de desarrollador
   - Accede al panel de desarrolladores

2. **Obtener las llaves:**
   - **Public Key:** Para el frontend (widget de pago)
   - **Private Key:** Para el backend (crear transacciones)
   - **Integrity Key:** Para generar firmas de integridad

3. **Configurar el entorno:**
   - Usa `sandbox` para pruebas
   - Usa `production` para producción

## 🔧 Solución al error de firma:

El error "signature: Firma de integridad requerida no enviada" se debe a:

1. **Falta la variable `WOMPI_INTEGRITY_KEY`**
2. **La firma se genera incorrectamente**

## ✅ Código corregido:

El endpoint `/api/payments/generate-signature` ya está corregido para usar:
- `crypto.createHash('sha256')` en lugar de `crypto.createHmac()`
- Orden correcto: `reference + amount + currency + integrityKey`

## 🚀 Próximos pasos:

1. Crear el archivo `.env.local` con las llaves reales
2. Reiniciar el servidor
3. Probar el pago nuevamente

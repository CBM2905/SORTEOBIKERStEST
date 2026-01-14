# Sistema de Rifa Motos - Integración Wompi

## 📋 Descripción General

Sistema de compra de boletas para rifa con integración de pasarela de pagos Wompi. Los usuarios pueden agregar boletas al carrito y realizar pagos seguros.

## 🏗️ Arquitectura del Sistema

```
Cliente (React)
    ↓
Carrito de Compras (Context)
    ↓
API Create Payment (/api/create-payment)
    ↓
Wompi Checkout
    ↓
Webhook Wompi (/api/wompi-webhook) → Base de Datos (Supabase)
    ↓
Verificación de Pago (/api/check-payment)
    ↓
Página de Resultado
```

## 🔄 Flujo Completo de Compra

### 1. **Selección de Boletas (Home)**
```
Usuario navega la página principal
    ↓
Ve las boletas disponibles con sus precios
    ↓
Hace clic en "Agregar al Carrito"
    ↓
Item se agrega a CartContext
    ↓
Contador en navbar se actualiza
```

### 2. **Revisión del Carrito (/cart)**
```
Usuario hace clic en el icono del carrito
    ↓
Ve resumen de items, cantidades y total
    ↓
Puede:
  - Aumentar/disminuir cantidad
  - Eliminar items
  - Vaciar carrito completo
    ↓
Ingresa email
    ↓
Hace clic en "Proceder al Pago"
```

### 3. **Creación del Pago**
```
POST /api/create-payment con:
{
  items: [{ id, title, price, quantity }],
  totalAmount: number,
  email: string
}
    ↓
API genera:
  - reference: único para esta transacción
  - Calcula: totalAmount * 100 (para centavos)
  - Crea payment link en Wompi
    ↓
Retorna: URL de Wompi checkout
    ↓
Redirige a usuario a Wompi
```

### 4. **Pago en Wompi**
```
Usuario completa el pago en Wompi
    ↓
Wompi procesa la transacción
    ↓
Envía webhook a /api/wompi-webhook con:
{
  data: {
    transaction: {
      id: string,
      reference: string,
      status: "APPROVED" | "DECLINED" | "VOIDED",
      amount_in_cents: number
    }
  }
}
```

### 5. **Webhook - Guardado en Base de Datos**
```
POST /api/wompi-webhook
    ↓
Valida firma (HMAC SHA256)
    ↓
Parsea JSON
    ↓
Extrae transacción
    ↓
Guarda en Supabase:
  - transactions
    - id (auto)
    - reference (unique)
    - wompi_transaction_id
    - status ("approved" | "declined" | "voided")
    - amount_in_cents
    - email
    - items_data (JSON)
    - created_at
    - updated_at
    ↓
Si status = "APPROVED":
  - Actualiza stock (opcional)
  - Envía email de confirmación (opcional)
  - Genera boleta PDF (opcional)
    ↓
Responde: { received: true }
```

### 6. **Wompi Redirige al Cliente**
```
Wompi redirige a:
/payment/verification?reference={reference}
```

### 7. **Verificación de Pago (/payment/verification)**
```
Página carga
    ↓
Extrae reference del URL
    ↓
GET /api/check-payment?reference={reference}
    ↓
API verifica:
  1. Busca en Supabase (transactions)
  2. Si no existe, consulta Wompi API
    ↓
Retorna status real del pago
    ↓
Componente muestra:
  
  Si APPROVED ✅:
    - Mensaje de éxito
    - Referencia de transacción
    - Botón volver al inicio
    - Aviso de email de confirmación
  
  Si DECLINED ❌:
    - Mensaje de rechazo
    - Opción de reintentar
  
  Si PENDING ⏳:
    - Mensaje "en proceso"
    - Reintenta cada 3 segundos
  
  Si ERROR:
    - Mensaje de error
    - Botón para volver
```

## 📊 Estructura de Base de Datos (Supabase)

### Tabla: `transactions`

```sql
CREATE TABLE transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  reference VARCHAR(255) UNIQUE NOT NULL,
  wompi_transaction_id VARCHAR(255),
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'declined', 'voided')),
  amount_in_cents BIGINT NOT NULL,
  email VARCHAR(255),
  items_data JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_amount CHECK (amount_in_cents > 0)
);

CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_email ON transactions(email);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
```

### items_data (ejemplo):
```json
[
  {
    "id": "1",
    "title": "Boleta Gold",
    "price": 1600,
    "quantity": 2
  }
]
```

## 🔐 Variables de Entorno

```env
# .env.local

# Wompi
NEXT_PUBLIC_WOMPI_ENV=https://sandbox.wompi.co
WOMPI_PRIVATE_KEY=prv_test_xxxxx
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxxxx
WOMPI_EVENTS_SECRET=events_secret_xxxxx

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase (para futuro)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_KEY=xxxxx
```

## 🔄 Estados de Pago

| Estado | Descripción | Acción |
|--------|-------------|--------|
| `APPROVED` | Pago exitoso | Crear boleta, enviar email |
| `DECLINED` | Pago rechazado | Permitir reintentar |
| `VOIDED` | Pago anulado | Mostrar error |
| `PENDING` | En procesamiento | Reintentar cada 3s |

## 📱 Componentes Principales

### 1. **CartContext** (`app/context/CartContext.tsx`)
- Maneja estado global del carrito
- Métodos: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`

### 2. **AwardCard** (`app/components/AwardCard.tsx`)
- Muestra boleta individual
- Botón "Agregar al Carrito"

### 3. **CartIcon** (`app/components/CartIcon.tsx`)
- Icono con contador de items
- Link a página `/cart`

### 4. **Página de Carrito** (`app/cart/page.tsx`)
- Lista items del carrito
- Ajusta cantidades
- Calcula total
- Formulario de email
- Botón "Proceder al Pago"

### 5. **Verificación** (`app/payment/verification/page.tsx`)
- Verifica estado real del pago
- Muestra resultado (éxito/error/pendiente)
- Reintentos automáticos

## 🚀 API Endpoints

### POST `/api/create-payment`
Crea un pago en Wompi

**Request:**
```json
{
  "items": [
    { "id": "1", "title": "Boleta", "price": 1600, "quantity": 2 }
  ],
  "totalAmount": 3200,
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "paymentUrl": "https://checkout.wompi.co/l/test_xxxxx"
}
```

### POST `/api/wompi-webhook`
Recibe notificaciones de Wompi

**Request:** (Wompi envía)
```json
{
  "data": {
    "transaction": {
      "id": "xxx",
      "reference": "order-123-xxx",
      "status": "APPROVED",
      "amount_in_cents": 320000
    }
  }
}
```

### GET `/api/check-payment`
Verifica estado del pago

**Request:**
```
/api/check-payment?reference=order-123-xxx
```

**Response:**
```json
{
  "status": "approved",
  "message": "Pago aprobado",
  "transaction": { ... }
}
```

## ✅ Checklist de Implementación

- [ ] Configurar variables de entorno de Wompi
- [ ] Crear tabla `transactions` en Supabase
- [ ] Implementar CartContext
- [ ] Crear componentes de UI
- [ ] Implementar `/api/create-payment`
- [ ] Implementar `/api/wompi-webhook`
- [ ] Implementar `/api/check-payment`
- [ ] Crear página de carrito
- [ ] Crear página de verificación
- [ ] Probar flujo completo en sandbox
- [ ] Configurar URL de webhook en Wompi
- [ ] Deploy a producción

## 🧪 Testing del Webhook

Para probar el webhook localmente:

```bash
# 1. Instala ngrok para exponer tu localhost
ngrok http 3000

# 2. Configura en Wompi dashboard:
# Webhook URL: https://tu-ngrok-url.com/api/wompi-webhook

# 3. En la consola de Wompi, envía un evento de prueba
# O simula manualmente con:

curl -X POST http://localhost:3000/api/wompi-webhook \
  -H "Content-Type: application/json" \
  -H "X-Wompi-Signature: your-signature" \
  -d '{"data":{"transaction":{"id":"test","reference":"order-test","status":"APPROVED","amount_in_cents":160000}}}'
```

## 📝 Logs Importantes

Revisa la consola del servidor para:
- ✅ "Transacción guardada: order-xxx"
- ✅ "Pago aprobado: order-xxx"
- ❌ "Pago rechazado: order-xxx"
- ⏳ "Verificando transacción..."

## 🔗 Recursos

- [Documentación Wompi](https://docs.wompi.co)
- [Supabase](https://supabase.com)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Última actualización:** Enero 3, 2026

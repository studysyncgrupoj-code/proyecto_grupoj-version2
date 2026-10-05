# Backend API Contract

**Versión:** `v1`
**Estado:** Approved for implementation
**Formato:** JSON
**Autenticación:** Bearer Access Token
**Endpoints:** 28

---

## 1. Propósito

Este documento define el contrato HTTP entre el **GraphQL BFF** y el **backend principal**.

```text
Frontend
   │
   │ GraphQL
   ▼
GraphQL Yoga / BFF
   │
   │ BackendClient
   ▼
REST Backend API
   │
   ▼
Business Logic / Database
```

El backend principal debe implementar los endpoints definidos en este documento.

El BFF no debe depender de detalles internos del backend.

---

# 2. Base URL

El BFF utiliza:

```env
API_BASE_URL=https://api.example.com
```

Todas las rutas de este documento son relativas a `API_BASE_URL`.

Ejemplo:

```http
GET https://api.example.com/users/me
```

---

# 3. Autenticación

Los endpoints privados utilizan un Access Token:

```http
Authorization: Bearer <access_token>
```

Ejemplo:

```http
Authorization: Bearer eyJhbGciOi...
```

El backend es responsable de:

- validar el token;
- determinar el usuario autenticado;
- comprobar permisos;
- rechazar tokens inválidos o expirados.

El backend **no debe confiar únicamente en que la petición provenga del BFF**.

---

# 4. Headers

Las peticiones JSON deben utilizar:

```http
Content-Type: application/json
Accept: application/json
```

Las peticiones autenticadas deben incluir:

```http
Authorization: Bearer <access_token>
```

---

# 5. Formato de errores

Los errores deben utilizar una estructura consistente:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": null
  }
}
```

Cuando existan detalles de validación:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

## 5.1 Códigos HTTP

|  HTTP | Código                | Uso                                         |
| ----: | --------------------- | ------------------------------------------- |
| `400` | `BAD_REQUEST`         | Request malformado                          |
| `401` | `UNAUTHENTICATED`     | Token ausente, inválido o expirado          |
| `403` | `FORBIDDEN`           | Usuario autenticado sin permisos            |
| `404` | `NOT_FOUND`           | Recurso inexistente                         |
| `409` | `CONFLICT`            | Operación incompatible con el estado actual |
| `422` | `VALIDATION_ERROR`    | Datos inválidos                             |
| `429` | `RATE_LIMITED`        | Límite de peticiones excedido               |
| `500` | `INTERNAL_ERROR`      | Error interno                               |
| `502` | `UPSTREAM_ERROR`      | Error en dependencia externa                |
| `503` | `SERVICE_UNAVAILABLE` | Servicio temporalmente no disponible        |

---

# 6. Convenciones de datos

## 6.1 IDs

Los IDs se representan como `string`.

```json
{
  "id": "usr_123"
}
```

---

## 6.2 Fechas

Todas las fechas deben utilizar ISO 8601.

Ejemplo:

```text
2026-10-04T18:30:00Z
```

---

## 6.3 Valores nulos

Cuando un campo puede no tener valor, debe devolverse explícitamente como `null`.

Ejemplo:

```json
{
  "image": null,
  "phone": null
}
```

No se debe cambiar arbitrariamente entre:

```json
null
```

y:

```json
""
```

---

# 7. Users

## 7.1 GET `/users/me`

Obtiene el usuario autenticado.

### Authentication

Required.

### Request

```http
GET /users/me
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
{
  "id": "usr_123",
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://example.com/avatar.jpg",
  "role": "student",
  "profile": {
    "bio": {
      "title": "Software Developer",
      "description": "Developer interested in technology."
    },
    "interests": ["programming", "technology"]
  }
}
```

### Response type

```ts
BackendUser;
```

### Errores

```text
401 UNAUTHENTICATED
500 INTERNAL_ERROR
```

---

# 8. Public Profile

## 8.1 GET `/users/:userId/profile`

Obtiene el perfil público de un usuario.

### Authentication

No requerida.

### Request

```http
GET /users/usr_123/profile
```

### Response `200 OK`

```json
{
  "id": "usr_123",
  "name": "John Doe",
  "image": "https://example.com/avatar.jpg",
  "bio": {
    "title": "Software Developer",
    "description": "Developer interested in technology."
  },
  "interests": ["programming", "technology"],
  "email": null,
  "phone": null
}
```

### Response type

```ts
BackendPublicProfile | null;
```

Si el usuario no existe o no puede exponerse públicamente:

```http
404 Not Found
```

### Errores

```text
404 NOT_FOUND
```

---

# 9. Profile

## 9.1 PATCH `/users/me/profile`

Actualiza el perfil del usuario autenticado.

### Authentication

Required.

### Request

```http
PATCH /users/me/profile
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "bio": {
    "title": "Software Developer",
    "description": "Updated description"
  },
  "interests": ["programming", "technology"]
}
```

### Request type

```ts
BackendUpdateProfileInput;
```

Definición:

```ts
interface BackendUpdateProfileInput {
  bio?: BackendBio | null;
  interests?: string[] | null;
}
```

Todos los campos son opcionales.

### Response `200 OK`

```json
{
  "id": "usr_123",
  "name": "John Doe",
  "email": "john@example.com",
  "image": null,
  "role": "student",
  "profile": {
    "bio": {
      "title": "Software Developer",
      "description": "Updated description"
    },
    "interests": ["programming", "technology"]
  }
}
```

### Response type

```ts
BackendUser;
```

### Errores

```text
401 UNAUTHENTICATED
422 VALIDATION_ERROR
```

---

# 10. Personal Data

## 10.1 GET `/users/me/personal-data`

Obtiene los datos personales del usuario.

### Authentication

Required.

### Request

```http
GET /users/me/personal-data
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "documentId": "123456789",
  "phone": "+573001234567",
  "country": "CO",
  "address": "Example address",
  "identityLocked": false
}
```

### Response type

```ts
BackendPersonalData;
```

### Errores

```text
401 UNAUTHENTICATED
500 INTERNAL_ERROR
```

---

## 10.2 PATCH `/users/me/personal-data`

Actualiza datos personales.

### Authentication

Required.

### Request

```http
PATCH /users/me/personal-data
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "documentId": "123456789",
  "phone": "+573001234567",
  "country": "CO",
  "address": "New address"
}
```

### Request type

```ts
BackendUpdatePersonalDataInput;
```

Definición:

```ts
type BackendUpdatePersonalDataInput = Partial<
  Omit<BackendPersonalData, 'identityLocked'>
>;
```

Por tanto, `identityLocked` **nunca se recibe desde el cliente**.

### Response `200 OK`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "documentId": "123456789",
  "phone": "+573001234567",
  "country": "CO",
  "address": "New address",
  "identityLocked": false
}
```

### Errores

```text
401 UNAUTHENTICATED
403 FORBIDDEN
409 CONFLICT
422 VALIDATION_ERROR
```

---

# 11. Privacy

## 11.1 GET `/users/me/privacy`

Obtiene la configuración de privacidad.

### Authentication

Required.

### Response `200 OK`

```json
{
  "profileVisibility": "everyone",
  "emailVisibility": "authenticated",
  "phoneVisibility": "nobody",
  "allowDirectMessages": true
}
```

### Response type

```ts
BackendPrivacySettings;
```

### Valores

```text
everyone
authenticated
nobody
```

### Errores

```text
401 UNAUTHENTICATED
500 INTERNAL_ERROR
```

---

## 11.2 PATCH `/users/me/privacy`

Actualiza la configuración de privacidad.

### Request

```http
PATCH /users/me/privacy
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "profileVisibility": "authenticated",
  "emailVisibility": "nobody",
  "phoneVisibility": "nobody",
  "allowDirectMessages": false
}
```

### Request type

```ts
BackendUpdatePrivacySettingsInput;
```

Definición:

```ts
type BackendUpdatePrivacySettingsInput = Partial<BackendPrivacySettings>;
```

Todos los campos son opcionales.

### Response `200 OK`

```json
{
  "profileVisibility": "authenticated",
  "emailVisibility": "nobody",
  "phoneVisibility": "nobody",
  "allowDirectMessages": false
}
```

### Errores

```text
401 UNAUTHENTICATED
422 VALIDATION_ERROR
```

---

# 12. Security

## 12.1 GET `/users/me/security`

Obtiene información de seguridad.

### Authentication

Required.

### Response `200 OK`

```json
{
  "email": "john@example.com",
  "emailVerified": true,
  "twoFactorEnabled": false,
  "twoFactorRequired": false,
  "sessions": [
    {
      "id": "session_123",
      "deviceName": "Windows PC",
      "browser": "Chrome",
      "ipAddress": "192.168.1.1",
      "lastActiveAt": "2026-10-04T18:30:00Z",
      "current": true
    }
  ]
}
```

### Response type

```ts
BackendSecuritySettings;
```

---

## 12.2 POST `/users/me/security/email-change`

Solicita un cambio de email.

### Request

```http
POST /users/me/security/email-change
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "newEmail": "new@example.com"
}
```

### Request type

```ts
BackendRequestEmailChangeInput;
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Email change request sent"
}
```

### Response type

```ts
BackendSecurityOperationResult;
```

### Errores

```text
401 UNAUTHENTICATED
409 CONFLICT
422 VALIDATION_ERROR
```

---

## 12.3 PUT `/users/me/security/password`

Cambia la contraseña.

### Request

```http
PUT /users/me/security/password
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "currentPassword": "current-password",
  "newPassword": "new-password"
}
```

### Request type

```ts
BackendChangePasswordInput;
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Errores

```text
401 UNAUTHENTICATED
422 VALIDATION_ERROR
409 CONFLICT
```

---

## 12.4 POST `/users/me/security/two-factor/setup`

Inicia la configuración de 2FA.

### Request

```http
POST /users/me/security/two-factor/setup
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
{
  "secret": "BASE32_SECRET",
  "qrCode": "data:image/png;base64,..."
}
```

### Response type

```ts
BackendTwoFactorSetup;
```

### Seguridad

`secret` es información sensible.

No debe:

- almacenarse en logs;
- enviarse a servicios de analytics;
- exponerse innecesariamente;
- incluirse en respuestas distintas de este endpoint.

---

## 12.5 POST `/users/me/security/two-factor/verify`

Verifica el código de configuración 2FA.

### Request

```http
POST /users/me/security/two-factor/verify
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "code": "123456"
}
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Two-factor authentication enabled"
}
```

### Errores

```text
401 UNAUTHENTICATED
422 VALIDATION_ERROR
409 CONFLICT
```

---

## 12.6 POST `/users/me/security/two-factor/disable`

Desactiva 2FA.

### Request

```http
POST /users/me/security/two-factor/disable
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "code": "123456"
}
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Two-factor authentication disabled"
}
```

### Errores

```text
401 UNAUTHENTICATED
403 FORBIDDEN
422 VALIDATION_ERROR
```

---

## 12.7 DELETE `/users/me/security/sessions/:sessionId`

Revoca una sesión.

### Request

```http
DELETE /users/me/security/sessions/session_123
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Session revoked"
}
```

### Errores

```text
401 UNAUTHENTICATED
404 NOT_FOUND
```

---

## 12.8 DELETE `/users/me/security/sessions/others`

Revoca todas las sesiones excepto la actual.

### Request

```http
DELETE /users/me/security/sessions/others
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Other sessions revoked"
}
```

### Errores

```text
401 UNAUTHENTICATED
```

---

# 13. Preferences

## 13.1 GET `/users/me/preferences`

Obtiene las preferencias.

### Response `200 OK`

```json
{
  "language": "es",
  "theme": "dark",
  "timezone": "America/Bogota",
  "notifications": {
    "email": true,
    "push": true,
    "inApp": true
  },
  "accessibility": {
    "reducedMotion": false,
    "highContrast": false
  }
}
```

### Response type

```ts
BackendPreferences;
```

---

## 13.2 PATCH `/users/me/preferences`

Actualiza parcialmente las preferencias.

### Request

```http
PATCH /users/me/preferences
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "language": "es",
  "theme": "dark",
  "timezone": "America/Bogota",
  "notifications": {
    "email": true,
    "push": false
  },
  "accessibility": {
    "highContrast": true
  }
}
```

### Request type

```ts
BackendUpdatePreferencesInput;
```

Definición:

```ts
interface BackendUpdatePreferencesInput {
  language?: string | null;
  theme?: BackendTheme | null;
  timezone?: string | null;
  notifications?: Partial<BackendPreferences['notifications']> | null;
  accessibility?: Partial<BackendPreferences['accessibility']> | null;
}
```

El backend debe realizar un **merge parcial**.

Por ejemplo:

```json
{
  "notifications": {
    "push": false
  }
}
```

no debe eliminar ni modificar:

```text
notifications.email
notifications.inApp
```

### Response `200 OK`

Debe devolver el objeto completo:

```json
{
  "language": "es",
  "theme": "dark",
  "timezone": "America/Bogota",
  "notifications": {
    "email": true,
    "push": false,
    "inApp": true
  },
  "accessibility": {
    "reducedMotion": false,
    "highContrast": true
  }
}
```

### Errores

```text
401 UNAUTHENTICATED
422 VALIDATION_ERROR
```

---

# 14. Account

## 14.1 GET `/users/me/account`

Obtiene el estado de la cuenta.

### Response `200 OK`

```json
{
  "status": "active",
  "createdAt": "2026-01-01T12:00:00Z"
}
```

### Response type

```ts
BackendAccount;
```

### Valores de status

```text
active
suspended
inactive
```

---

## 14.2 POST `/users/me/account/deactivation`

Solicita la desactivación de la cuenta.

### Request

```http
POST /users/me/account/deactivation
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
{
  "status": "inactive",
  "createdAt": "2026-01-01T12:00:00Z"
}
```

### Errores

```text
401 UNAUTHENTICATED
409 CONFLICT
```

---

## 14.3 DELETE `/users/me/account/deactivation`

Cancela la desactivación.

### Request

```http
DELETE /users/me/account/deactivation
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
{
  "status": "active",
  "createdAt": "2026-01-01T12:00:00Z"
}
```

### Errores

```text
401 UNAUTHENTICATED
409 CONFLICT
```

---

# 15. Courses

## 15.1 GET `/users/me/courses`

Obtiene los cursos del usuario.

### Request

```http
GET /users/me/courses
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
[
  {
    "courseId": "course_123",
    "title": "Introduction to Programming",
    "progress": 0.75,
    "status": "active",
    "enrolledAt": "2026-01-10T12:00:00Z",
    "completedAt": null
  }
]
```

### Response type

```ts
BackendCourseEnrollment[]
```

### Valores de status

```text
active
completed
paused
```

`progress` debe representar un valor entre `0` y `1`.

### Errores

```text
401 UNAUTHENTICATED
```

---

# 16. Certificates

## 16.1 GET `/users/me/certificates`

Obtiene los certificados del usuario.

### Request

```http
GET /users/me/certificates
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
[
  {
    "id": "cert_123",
    "courseId": "course_123",
    "courseTitle": "Introduction to Programming",
    "certificateNumber": "CERT-2026-001",
    "issuedAt": "2026-05-10T12:00:00Z",
    "downloadUrl": "https://example.com/certificates/cert_123.pdf"
  }
]
```

### Response type

```ts
BackendCertificate[]
```

### Errores

```text
401 UNAUTHENTICATED
```

---

# 17. Subscription

## 17.1 GET `/users/me/subscription`

Obtiene la suscripción actual.

### Response `200 OK`

Cuando existe:

```json
{
  "id": "sub_123",
  "plan": "premium",
  "status": "active",
  "startedAt": "2026-01-01T12:00:00Z",
  "currentPeriodEnd": "2026-11-01T12:00:00Z",
  "cancelAtPeriodEnd": false
}
```

Cuando no existe:

```json
null
```

### Response type

```ts
BackendSubscription | null;
```

### Planes

```text
free
premium
enterprise
```

### Estados

```text
trialing
active
past_due
canceled
expired
```

### Errores

```text
401 UNAUTHENTICATED
```

---

## 17.2 PUT `/users/me/subscription/plan`

Cambia el plan.

### Request

```http
PUT /users/me/subscription/plan
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Body

```json
{
  "plan": "premium"
}
```

### Request type

```ts
BackendSubscriptionPlan;
```

### Response `200 OK`

```json
{
  "id": "sub_123",
  "plan": "premium",
  "status": "active",
  "startedAt": "2026-01-01T12:00:00Z",
  "currentPeriodEnd": "2026-11-01T12:00:00Z",
  "cancelAtPeriodEnd": false
}
```

### Errores

```text
401 UNAUTHENTICATED
409 CONFLICT
422 VALIDATION_ERROR
```

---

## 17.3 POST `/users/me/subscription/cancellation`

Solicita la cancelación de la suscripción.

### Request

```http
POST /users/me/subscription/cancellation
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
{
  "id": "sub_123",
  "plan": "premium",
  "status": "active",
  "startedAt": "2026-01-01T12:00:00Z",
  "currentPeriodEnd": "2026-11-01T12:00:00Z",
  "cancelAtPeriodEnd": true
}
```

### Errores

```text
401 UNAUTHENTICATED
404 NOT_FOUND
409 CONFLICT
```

---

# 18. Payment Methods

## 18.1 GET `/users/me/payment-methods`

Obtiene los métodos de pago.

### Request

```http
GET /users/me/payment-methods
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
[
  {
    "id": "pm_123",
    "brand": "visa",
    "last4": "4242",
    "expirationMonth": 12,
    "expirationYear": 2028
  }
]
```

### Response type

```ts
BackendPaymentMethod[]
```

### Seguridad

Nunca devolver:

```text
cardNumber
pan
cvv
cvc
securityCode
```

La API únicamente expone:

- `brand`
- `last4`
- `expirationMonth`
- `expirationYear`

### Errores

```text
401 UNAUTHENTICATED
```

---

## 18.2 DELETE `/users/me/payment-methods/:paymentMethodId`

Elimina un método de pago.

### Request

```http
DELETE /users/me/payment-methods/pm_123
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
true
```

### Response type

```ts
boolean;
```

### Errores

```text
401 UNAUTHENTICATED
404 NOT_FOUND
409 CONFLICT
```

---

# 19. Invoices

## 19.1 GET `/users/me/invoices`

Obtiene las facturas del usuario.

### Request

```http
GET /users/me/invoices
Authorization: Bearer <access_token>
```

### Response `200 OK`

```json
[
  {
    "id": "inv_123",
    "number": "INV-2026-001",
    "amount": 29900,
    "currency": "COP",
    "status": "paid",
    "issuedAt": "2026-09-01T12:00:00Z",
    "downloadUrl": "https://example.com/invoices/inv_123.pdf"
  }
]
```

### Response type

```ts
BackendInvoice[]
```

### Estados

```text
draft
open
paid
void
uncollectible
```

### Errores

```text
401 UNAUTHENTICATED
```

---

# 20. Resumen de endpoints

|   # | Método | Endpoint                                     | Auth | Request                             | Response                         |
| --: | ------ | -------------------------------------------- | :--: | ----------------------------------- | -------------------------------- |
|   1 | GET    | `/users/me`                                  |  ✓   | —                                   | `BackendUser`                    |
|   2 | GET    | `/users/:userId/profile`                     |  —   | —                                   | `BackendPublicProfile \| null`   |
|   3 | PATCH  | `/users/me/profile`                          |  ✓   | `BackendUpdateProfileInput`         | `BackendUser`                    |
|   4 | GET    | `/users/me/personal-data`                    |  ✓   | —                                   | `BackendPersonalData`            |
|   5 | PATCH  | `/users/me/personal-data`                    |  ✓   | `BackendUpdatePersonalDataInput`    | `BackendPersonalData`            |
|   6 | GET    | `/users/me/privacy`                          |  ✓   | —                                   | `BackendPrivacySettings`         |
|   7 | PATCH  | `/users/me/privacy`                          |  ✓   | `BackendUpdatePrivacySettingsInput` | `BackendPrivacySettings`         |
|   8 | GET    | `/users/me/security`                         |  ✓   | —                                   | `BackendSecuritySettings`        |
|   9 | POST   | `/users/me/security/email-change`            |  ✓   | `BackendRequestEmailChangeInput`    | `BackendSecurityOperationResult` |
|  10 | PUT    | `/users/me/security/password`                |  ✓   | `BackendChangePasswordInput`        | `BackendSecurityOperationResult` |
|  11 | POST   | `/users/me/security/two-factor/setup`        |  ✓   | —                                   | `BackendTwoFactorSetup`          |
|  12 | POST   | `/users/me/security/two-factor/verify`       |  ✓   | `{ code }`                          | `BackendSecurityOperationResult` |
|  13 | POST   | `/users/me/security/two-factor/disable`      |  ✓   | `{ code }`                          | `BackendSecurityOperationResult` |
|  14 | DELETE | `/users/me/security/sessions/:sessionId`     |  ✓   | —                                   | `BackendSecurityOperationResult` |
|  15 | DELETE | `/users/me/security/sessions/others`         |  ✓   | —                                   | `BackendSecurityOperationResult` |
|  16 | GET    | `/users/me/preferences`                      |  ✓   | —                                   | `BackendPreferences`             |
|  17 | PATCH  | `/users/me/preferences`                      |  ✓   | `BackendUpdatePreferencesInput`     | `BackendPreferences`             |
|  18 | GET    | `/users/me/account`                          |  ✓   | —                                   | `BackendAccount`                 |
|  19 | POST   | `/users/me/account/deactivation`             |  ✓   | —                                   | `BackendAccount`                 |
|  20 | DELETE | `/users/me/account/deactivation`             |  ✓   | —                                   | `BackendAccount`                 |
|  21 | GET    | `/users/me/courses`                          |  ✓   | —                                   | `BackendCourseEnrollment[]`      |
|  22 | GET    | `/users/me/certificates`                     |  ✓   | —                                   | `BackendCertificate[]`           |
|  23 | GET    | `/users/me/subscription`                     |  ✓   | —                                   | `BackendSubscription \| null`    |
|  24 | PUT    | `/users/me/subscription/plan`                |  ✓   | `{ plan }`                          | `BackendSubscription`            |
|  25 | POST   | `/users/me/subscription/cancellation`        |  ✓   | —                                   | `BackendSubscription`            |
|  26 | GET    | `/users/me/payment-methods`                  |  ✓   | —                                   | `BackendPaymentMethod[]`         |
|  27 | GET    | `/users/me/invoices`                         |  ✓   | —                                   | `BackendInvoice[]`               |
|  28 | DELETE | `/users/me/payment-methods/:paymentMethodId` |  ✓   | —                                   | `boolean`                        |

---

# 21. Responsabilidad de cada capa

## Frontend

Consume únicamente GraphQL.

```text
React
  ↓
GraphQL
```

No debe llamar directamente al REST Backend.

---

## GraphQL BFF

Expone el contrato GraphQL y transforma las operaciones en llamadas al `BackendClient`.

```text
GraphQL Resolver
      ↓
BackendClient
```

Los resolvers no deben utilizar `fetch()` directamente.

---

## BackendClient

Define la abstracción entre GraphQL y el backend.

Actualmente:

```text
BackendClient
     ↓
RestBackendClient
     ↓
REST API
```

En el futuro podría ser:

```text
BackendClient
     ↓
GrpcBackendClient
     ↓
gRPC
```

Los resolvers no deberían necesitar cambios.

---

## Backend principal

Es responsable de:

- autenticación;
- autorización;
- validación;
- reglas de negocio;
- persistencia;
- integración con servicios externos;
- seguridad;
- consistencia de datos.

---

# 22. Reglas importantes

## 22.1 `/users/me` depende del token

El backend determina el usuario mediante el Access Token.

No debe aceptarse un `userId` para decidir quién es el usuario actual.

Incorrecto:

```http
GET /users/me?userId=123
```

Correcto:

```http
GET /users/me
Authorization: Bearer <access_token>
```

---

## 22.2 Autorización en el backend

El BFF puede impedir operaciones antes de enviarlas al backend, pero el backend debe volver a validar autorización.

La seguridad no debe depender del BFF.

---

## 22.3 Updates parciales

Los endpoints `PATCH` deben mantener los valores no enviados.

Ejemplo:

```json
{
  "language": "es"
}
```

no debe borrar:

```text
theme
timezone
notifications
accessibility
```

---

## 22.4 `identityLocked`

`identityLocked` es un campo de respuesta.

No puede ser modificado mediante:

```http
PATCH /users/me/personal-data
```

El cliente nunca debe poder establecer:

```json
{
  "identityLocked": false
}
```

---

## 22.5 Datos de pago

El backend no debe almacenar ni devolver información sensible de tarjetas si la arquitectura de pagos utiliza un proveedor especializado.

La API solamente expone:

```text
id
brand
last4
expirationMonth
expirationYear
```

---

# 23. GraphQL → REST mapping

| GraphQL                      | REST                                                |
| ---------------------------- | --------------------------------------------------- |
| `me`                         | `GET /users/me`                                     |
| `publicProfile`              | `GET /users/:userId/profile`                        |
| `updateProfile`              | `PATCH /users/me/profile`                           |
| `myPersonalData`             | `GET /users/me/personal-data`                       |
| `updatePersonalData`         | `PATCH /users/me/personal-data`                     |
| `myPrivacySettings`          | `GET /users/me/privacy`                             |
| `updatePrivacySettings`      | `PATCH /users/me/privacy`                           |
| `mySecuritySettings`         | `GET /users/me/security`                            |
| `requestEmailChange`         | `POST /users/me/security/email-change`              |
| `changePassword`             | `PUT /users/me/security/password`                   |
| `beginTwoFactorSetup`        | `POST /users/me/security/two-factor/setup`          |
| `verifyTwoFactorSetup`       | `POST /users/me/security/two-factor/verify`         |
| `disableTwoFactor`           | `POST /users/me/security/two-factor/disable`        |
| `revokeSession`              | `DELETE /users/me/security/sessions/:sessionId`     |
| `revokeOtherSessions`        | `DELETE /users/me/security/sessions/others`         |
| `myPreferences`              | `GET /users/me/preferences`                         |
| `updatePreferences`          | `PATCH /users/me/preferences`                       |
| `myAccount`                  | `GET /users/me/account`                             |
| `requestAccountDeactivation` | `POST /users/me/account/deactivation`               |
| `cancelAccountDeactivation`  | `DELETE /users/me/account/deactivation`             |
| `myCourses`                  | `GET /users/me/courses`                             |
| `myCertificates`             | `GET /users/me/certificates`                        |
| `mySubscription`             | `GET /users/me/subscription`                        |
| `changeSubscriptionPlan`     | `PUT /users/me/subscription/plan`                   |
| `cancelSubscription`         | `POST /users/me/subscription/cancellation`          |
| `myPaymentMethods`           | `GET /users/me/payment-methods`                     |
| `myInvoices`                 | `GET /users/me/invoices`                            |
| `removePaymentMethod`        | `DELETE /users/me/payment-methods/:paymentMethodId` |

---

# 24. Estado del contrato

Este documento constituye el contrato inicial entre el BFF y el backend principal.

El backend debe implementar estas interfaces sin requerir cambios en los resolvers GraphQL.

Cualquier modificación incompatible debe coordinarse entre ambos lados antes de implementarse.

```text
Contract version: v1
REST endpoints: 28
GraphQL operations: 28
Authentication: Bearer Access Token
Content-Type: application/json
```

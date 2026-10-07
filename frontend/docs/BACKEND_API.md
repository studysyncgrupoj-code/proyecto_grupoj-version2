# Contrato de API del backend

**Versión:** `v1`

Este documento es el contrato formal de integración entre el frontend/BFF y el backend. Define lo que ambas partes deben implementar y cómo deben interactuar.

Es el **único documento del contrato**. Cualquier cambio en el contrato debe reflejarse primero aquí y después en el código del frontend (`src/lib/backend/types.ts`, el schema GraphQL y `RestBackendClient`).

El contrato puede implementarse en dos modos: contra un backend real (`rest`) o contra una implementación controlada que no requiere backend (`mock`). Ambos modos deben cumplir exactamente este contrato. Ver sección 1.1.

---

# 1. Cómo funciona la arquitectura

```text
Dashboard (React)  →  GraphQL (BFF)  →  API REST del backend

Sitio público (login, registro, recuperar contraseña, contacto)
        → API REST del backend
```

- Dentro del dashboard el frontend habla solo con GraphQL. El BFF traduce cada operación GraphQL a una llamada REST al backend.
- Fuera del dashboard, el servidor de Next.js llama al REST directamente para login, registro, recuperar contraseña y contacto.
- El backend **no debe confiar** en que la petición venga del BFF. Siempre debe validar el token y los permisos.

La URL base del backend es `API_BASE_URL`. Todas las rutas de este documento son relativas a ella.

## 1.1 Modos de operación

El contrato `v1` puede implementarse en dos modos:

| Modo   | Cuándo se usa                                                     | Fuente de datos                    |
| ------ | ----------------------------------------------------------------- | ---------------------------------- |
| `rest` | Entorno real. El frontend/BFF habla con el backend por HTTP.      | Backend en `API_BASE_URL`.         |
| `mock` | Entorno controlado (desarrollo, pruebas, demos) sin backend real. | Implementación local del contrato. |

El modo se selecciona mediante configuración del cliente (`BACKEND_MODE`), no mediante cambios en el contrato ni en los resolvers GraphQL.

### Regla de equivalencia

Ambos modos implementan **el mismo contrato**:

- Las operaciones expuestas por el cliente son idénticas.
- Los tipos de entrada y salida son idénticos.
- Los códigos HTTP y los `error.code` son idénticos.
- Los resolvers GraphQL y los route handlers no distinguen el modo.

### Alcance del modo `mock`

El modo `mock` cubre las operaciones que el frontend/BFF consume a través del cliente del contrato (ver sección 10, "Relación con el frontend").

Las rutas de autenticación pública y contacto (`/auth/*` y `/contact`) son consumidas por Auth.js y los route handlers de Next.js. Si se requiere operar esas rutas sin backend, deben cubrirse mediante un cliente equivalente, no extendiendo el cliente del dashboard.

### Garantías del modo `mock`

- No realiza peticiones de red.
- Devuelve datos deterministas y válidos según este contrato.
- Respeta los formatos definidos en la sección 9.
- Puede simular los errores definidos en las secciones 4 y 11.

### Regla de validez

Ningún modo puede alterar el contrato. Cualquier diferencia entre modos se considera un defecto de implementación, no una variación del contrato.

---

# 2. Autenticación

Hay dos tokens:

- **Access Token:** autentica las peticiones. Se envía como `Authorization: Bearer <token>`.
- **Refresh Token:** sirve únicamente para pedir un nuevo par de tokens en `POST /auth/refresh`. Nunca se usa en endpoints de negocio.

Niveles de autenticación que se usan en la tabla de endpoints:

| Nivel      | Qué significa                                                                              |
| ---------- | ------------------------------------------------------------------------------------------ |
| `None`     | No se lee el header `Authorization`.                                                       |
| `Optional` | Si llega un Bearer válido, el backend lo usa. Si no llega, trata la petición como anónima. |
| `Required` | El Bearer es obligatorio. Si falta o no es válido, responder `401`.                        |

En modo `mock` (sección 1.1), los tokens son valores sintéticos generados por la implementación controlada. No se validan contra el backend. Las reglas de autenticación de esta sección aplican al modo `rest`.

---

# 3. Cambios que el backend debe implementar

Esta sección define el comportamiento requerido por el contrato `v1`.

Los cambios respecto al backend actual (nombres de campos y rutas) están resumidos en la sección 14.

## 3.1 Nombres de campos

Los campos del contrato `v1` utilizan nombres en inglés.

### Respuesta de `POST /auth/login`

Dentro de `data`:

| Campo              | Tipo             | Descripción                            |
| ------------------ | ---------------- | -------------------------------------- |
| `firstName`        | `string`         | Nombre del usuario                     |
| `lastName`         | `string`         | Apellidos del usuario                  |
| `id`               | `string`         | Identificador único del usuario        |
| `role`             | `string`         | Rol del usuario                        |
| `subscription`     | `string \| null` | Suscripción, cuando corresponda        |
| `image`            | `string \| null` | Imagen del usuario                     |
| `token`            | `string`         | Access Token                           |
| `refreshToken`     | `string`         | Refresh Token                          |
| `expiresIn`        | `number`         | Duración del Access Token en segundos  |
| `refreshExpiresIn` | `number`         | Duración del Refresh Token en segundos |

`id` debe ser **el mismo valor** que devuelve `GET /users/me` en su campo `id`.

Los valores permitidos para `role` son:

```text
student
teacher
admin
```

Los valores permitidos para `subscription` son:

```text
free
premium
enterprise
```

`subscription` solo se envía cuando `role` es `student`. Para otros roles se omite.

`image` siempre se envía. Si el usuario no tiene imagen, su valor es `null`.

### Cuerpo de `POST /auth/register`

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "user@example.com",
  "password": "Password1!"
}
```

`email` no cambia respecto al backend actual (ver sección 14).

---

## 3.2 Login

`POST /auth/login`

El backend debe:

- devolver `firstName`, `lastName`, `id` y `role`;
- utilizar el mismo `id` que devuelve posteriormente `GET /users/me`;
- enviar `subscription` únicamente cuando corresponda;
- enviar `image`, pudiendo ser `null`;
- devolver un Access Token y un Refresh Token;
- devolver `expiresIn` y `refreshExpiresIn`.

Usuario o contraseña incorrectos:

```text
HTTP 401
```

Demasiados intentos:

```text
HTTP 429
error.code = RATE_LIMITED
```

---

## 3.3 Refresh Token

`POST /auth/refresh`

Debe existir **rotación de Refresh Token**:

1. El cliente envía el Refresh Token actual.
2. El backend valida el token.
3. El backend devuelve un nuevo Access Token.
4. El backend devuelve un nuevo Refresh Token.
5. El Refresh Token anterior deja de ser válido.

Un Refresh Token vencido, inválido o revocado debe responder:

```text
401 o 403
```

El frontend interpreta ambos códigos como finalización de sesión.

`400` se utiliza únicamente cuando el cuerpo de la petición está mal formado.

Los errores `5xx` se consideran errores temporales del servicio y no significan automáticamente que la sesión haya terminado.

---

## 3.4 Endpoints públicos del contrato

El contrato incluye:

| Endpoint                          | Para qué sirve                                               | Cuerpo                                              |
| --------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| `POST /auth/register`             | Crear cuenta                                                 | `{ firstName, lastName, email, password }`          |
| `POST /auth/forgot-password`      | Pedir correo de recuperación                                 | `{ email }`                                         |
| `POST /auth/validate-reset-token` | Validar token de recuperación antes de mostrar el formulario | `{ token }`                                         |
| `POST /auth/reset-password`       | Poner una contraseña nueva con el token                      | `{ token, newPassword }`                            |
| `POST /contact`                   | Formulario de contacto                                       | `{ name, email, contactNumber?, subject, message }` |

### Registro

Responde:

```text
201
```

Email repetido:

```text
409
```

Datos inválidos:

```text
400 o 422
```

Reglas de validación del cuerpo:

| Campo       | Regla                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| `firstName` | De 2 a 100 caracteres. Solo letras, espacios, apóstrofes, guiones y puntos.                               |
| `lastName`  | De 2 a 100 caracteres. Solo letras, espacios, apóstrofes, guiones y puntos.                               |
| `email`     | Formato de correo válido, hasta 254 caracteres. Se envía en minúsculas.                                   |
| `password`  | De 6 a 15 caracteres, con al menos una minúscula, una mayúscula y un carácter especial (por ejemplo `!`). |

La confirmación de la contraseña la valida el cliente y **nunca** se envía al backend.

### Recuperación de contraseña

Para evitar enumeración de usuarios, el backend debe responder `200` aunque el correo no exista.

### Validación del token de recuperación

La ruta para validar un token de recuperación antes de mostrar la página de restablecimiento es:

```http
POST /auth/validate-reset-token
```

Cuerpo:

```json
{
  "token": "reset-token"
}
```

El endpoint únicamente valida el token. No cambia la contraseña ni consume el token.

Si el token es válido, responde:

```text
200
```

con la respuesta `ResetTokenValidationResponse`:

```json
{
  "valid": true
}
```

La respuesta no debe incluir información del usuario (correo, nombre, etc.).

Si el token es inválido, vencido o ya fue utilizado, responde:

```text
400
```

con el código:

```text
INVALID_RESET_TOKEN
```

```json
{
  "error": {
    "code": "INVALID_RESET_TOKEN",
    "message": "El token de recuperación no es válido o ha expirado.",
    "details": null
  }
}
```

El frontend debe utilizar este endpoint para determinar si puede mostrar la página de restablecimiento de contraseña.

La validación del token no debe consumirlo. El token únicamente se consume cuando se ejecuta correctamente:

```text
POST /auth/reset-password
```

### Restablecimiento de contraseña

El token:

- es de un solo uso;
- caduca;
- no puede reutilizarse.

Token inválido, vencido o ya utilizado:

```text
400
```

Contraseña que no cumple las reglas:

```text
422
```

`newPassword` debe cumplir las mismas reglas que `password` en el registro (de 6 a 15 caracteres, con al menos una minúscula, una mayúscula y un carácter especial).

### Contacto

La ruta es:

```text
POST /contact
```

`contactNumber` es opcional.

Cuando se proporciona, debe utilizar formato internacional E.164.

Reglas de validación del cuerpo:

| Campo           | Regla                                                                              |
| --------------- | ---------------------------------------------------------------------------------- |
| `name`          | De 2 a 100 caracteres. Solo letras, espacios, apóstrofes, guiones y puntos.        |
| `email`         | Formato de correo válido, hasta 254 caracteres.                                    |
| `contactNumber` | Opcional. Formato E.164 (por ejemplo `+573001234567`). Se omite cuando está vacío. |
| `subject`       | De 5 a 150 caracteres. No admite los caracteres `<`, `>`, `{` ni `}`.              |
| `message`       | De 20 a 2000 caracteres. No admite los caracteres `<` ni `>`.                      |

---

## 3.5 Rutas especiales

### Revocar una sesión específica

La ruta para revocar una sesión concreta es:

```http
DELETE /users/me/security/sessions/:sessionId
```

El parámetro `sessionId` identifica la sesión que debe revocarse.

Esta operación requiere autenticación mediante Access Token.

Si la sesión indicada no existe o no pertenece al usuario autenticado, el backend debe responder:

```text
404 NOT_FOUND
```

### Revocar las demás sesiones

La ruta para revocar todas las sesiones del usuario autenticado, excepto la sesión actual, es:

```http
DELETE /users/me/security/sessions
```

Esta operación requiere autenticación mediante Access Token.

El backend debe identificar al usuario a partir del Access Token y revocar las demás sesiones activas asociadas a ese usuario.

La sesión utilizada para realizar la petición no debe revocarse.

La operación debe devolver:

```text
200
```

con la respuesta `BackendSecurityOperationResult`.

### Perfil público

La ruta para consultar el perfil público de un usuario es:

```http
GET /users/:userId/profile
```

La autenticación es **opcional**.

Si llega un Bearer válido, el backend puede utilizar la identidad autenticada para aplicar las reglas de privacidad:

- `profileVisibility`
- `emailVisibility`
- `phoneVisibility`

Si el usuario no existe o su perfil no puede mostrarse al solicitante, el backend debe responder:

```text
404
```

El backend **no debe responder `200` con `null`** en este caso.

El BFF es responsable de traducir ese `404` al comportamiento GraphQL correspondiente, que en este caso es devolver `null`.

---

# 4. Errores

Todos los errores deben utilizar el siguiente formato:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje legible",
    "details": null
  }
}
```

El campo `error.code` forma parte del contrato y debe ser estable.

El mensaje puede ser legible para diagnóstico, pero el frontend no debe depender del texto de `message`.

## 4.1 Códigos HTTP generales

|  HTTP | Código                | Cuándo                                                               |
| ----: | --------------------- | -------------------------------------------------------------------- |
| `400` | `BAD_REQUEST`         | Petición mal formada                                                 |
| `401` | `UNAUTHENTICATED`     | Token ausente, inválido o vencido; credenciales de login incorrectas |
| `403` | `FORBIDDEN`           | Usuario autenticado sin permiso                                      |
| `404` | `NOT_FOUND`           | El recurso no existe o no puede mostrarse al solicitante             |
| `409` | `CONFLICT`            | La operación no es compatible con el estado actual                   |
| `422` | `VALIDATION_ERROR`    | Datos inválidos                                                      |
| `429` | `RATE_LIMITED`        | Se superó el límite de peticiones                                    |
| `500` | `INTERNAL_ERROR`      | Error interno                                                        |
| `502` | `UPSTREAM_ERROR`      | Falló una dependencia externa                                        |
| `503` | `SERVICE_UNAVAILABLE` | Servicio no disponible temporalmente                                 |

## 4.2 Códigos de dominio

|  HTTP | Código                     | Endpoint                          |
| ----: | -------------------------- | --------------------------------- |
| `422` | `INVALID_CURRENT_PASSWORD` | `PUT /users/me/security/password` |
| `422` | `INVALID_CODE`             | 2FA `verify` y `disable`          |
| `409` | `PAYMENT_METHOD_REQUIRED`  | `PUT /users/me/subscription/plan` |

### Regla importante sobre `401`

`401` se reserva para:

- problemas con el Access Token;
- credenciales incorrectas en `/auth/login`;
- Refresh Token inválido, vencido o revocado cuando corresponda.

Una contraseña actual incorrecta durante un cambio de contraseña **no debe responder `401`**.

Debe utilizar:

```text
422 INVALID_CURRENT_PASSWORD
```

Un código 2FA incorrecto tampoco debe responder `401`.

Debe utilizar:

```text
422 INVALID_CODE
```

Esto es importante porque el BFF interpreta `401` como un problema de autenticación/sesión.

---

# 5. Cuenta

Estados posibles:

```text
active
pending_deactivation
suspended
inactive
```

La cuenta puede incluir:

```text
deactivationScheduledAt
```

Este campo es una fecha ISO 8601 o `null`.

`POST /users/me/account/deactivation`:

- cambia la cuenta a `pending_deactivation`;
- devuelve `deactivationScheduledAt`;
- si la cuenta no está `active`, responde `409`.

`DELETE /users/me/account/deactivation`:

- cancela la desactivación;
- devuelve la cuenta a `active`;
- solo funciona mientras la cuenta esté en `pending_deactivation`;
- en cualquier otro estado responde `409`.

La duración del periodo de gracia la determina el backend.

---

# 6. Suscripción

El cuerpo de:

```http
PUT /users/me/subscription/plan
```

es:

```json
{
  "plan": "premium"
}
```

Transiciones permitidas:

| Desde        | Hacia        | Resultado                                                                                     |
| ------------ | ------------ | --------------------------------------------------------------------------------------------- |
| `free`       | `premium`    | Permitido. Exige al menos un método de pago; si no, `409 PAYMENT_METHOD_REQUIRED`.            |
| `premium`    | `free`       | Permitido.                                                                                    |
| cualquiera   | `enterprise` | No se permite por API. Responder `403`. Enterprise se contrata por el formulario de contacto. |
| `enterprise` | cualquiera   | No se permite por API. Responder `403`.                                                       |
| cualquiera   | mismo plan   | Responder `409`.                                                                              |

---

# 7. Facturas y dinero

`amount` es un entero expresado en la unidad menor de la moneda.

Ejemplo:

```text
COP 49.900,00 → 4990000
```

El backend no debe devolver cantidades monetarias como valores de punto flotante si el contrato define el campo como entero.

El schema GraphQL del BFF debe exponer `amount` como `Int!`, coherente con el tipo entero del contrato REST.

---

# 8. Preferencias

Valores válidos:

| Campo      | Valores                                                   |
| ---------- | --------------------------------------------------------- |
| `language` | `es`, `en`                                                |
| `theme`    | `system`, `light`, `dark`                                 |
| `timezone` | Cualquier zona horaria IANA, por ejemplo `America/Bogota` |

Un valor no soportado responde:

```text
422 VALIDATION_ERROR
```

---

# 9. Reglas que aplican a todo el contrato

1. **`/users/me` depende del token.** El backend identifica al usuario por el Access Token. Nunca debe aceptar un `userId` para decidir quién es el usuario actual.

2. **Autorización en el backend.** El BFF puede bloquear operaciones antes, pero el backend debe validar nuevamente autenticación y autorización.

3. **`PATCH` es una actualización parcial.** Lo que no se envía no se modifica.

   Por ejemplo:

   ```json
   {
     "notifications": {
       "push": false
     }
   }
   ```

   no debe modificar:

   ```text
   notifications.email
   notifications.inApp
   ```

   La respuesta debe devolver el objeto completo.

4. **`identityLocked` nunca lo envía el cliente.** Es únicamente un campo de respuesta.

5. **Datos de pago.** Solo se exponen:

   ```text
   id
   brand
   last4
   expirationMonth
   expirationYear
   ```

   Nunca se devuelven número completo de tarjeta, CVV ni equivalentes.

6. **Secreto de 2FA.** El `secret` de `two-factor/setup` es sensible:

   - no se guarda en logs;
   - no se envía a analítica;
   - no se incluye en otras respuestas.

7. **Formatos.**

   Los IDs son `string`.

   Las fechas utilizan ISO 8601:

   ```text
   2026-10-04T18:30:00Z
   ```

   Si un campo puede no tener valor, se devuelve explícitamente como `null`, nunca alternando entre `null` y `""`.

8. **Headers.**

   Las peticiones JSON utilizan:

   ```http
   Content-Type: application/json
   Accept: application/json
   ```

---

# 10. Resumen de los 36 endpoints

|   # | Método | Ruta                                         | Auth     | Cuerpo                                     | Respuesta                        |
| --: | ------ | -------------------------------------------- | -------- | ------------------------------------------ | -------------------------------- |
|   1 | POST   | `/auth/login`                                | None     | `{ email, password }`                      | `LoginResponse`                  |
|   2 | POST   | `/auth/refresh`                              | None     | `{ refreshToken }`                         | `TokenPair`                      |
|   3 | POST   | `/auth/logout`                               | None     | `{ refreshToken }`                         | `LogoutResponse`                 |
|   4 | POST   | `/auth/register`                             | None     | `{ firstName, lastName, email, password }` | `RegisterResponse`               |
|   5 | POST   | `/auth/forgot-password`                      | None     | `{ email }`                                | `MessageResponse`                |
|   6 | POST   | `/auth/validate-reset-token`                 | None     | `{ token }`                                | `ResetTokenValidationResponse`   |
|   7 | POST   | `/auth/reset-password`                       | None     | `{ token, newPassword }`                   | `MessageResponse`                |
|   8 | POST   | `/contact`                                   | None     | `ContactInput`                             | `MessageResponse`                |
|   9 | GET    | `/users/me`                                  | Required | —                                          | `BackendUser`                    |
|  10 | GET    | `/users/:userId/profile`                     | Optional | —                                          | `BackendPublicProfile`           |
|  11 | PATCH  | `/users/me/profile`                          | Required | `BackendUpdateProfileInput`                | `BackendUser`                    |
|  12 | GET    | `/users/me/personal-data`                    | Required | —                                          | `BackendPersonalData`            |
|  13 | PATCH  | `/users/me/personal-data`                    | Required | `BackendUpdatePersonalDataInput`           | `BackendPersonalData`            |
|  14 | GET    | `/users/me/privacy`                          | Required | —                                          | `BackendPrivacySettings`         |
|  15 | PATCH  | `/users/me/privacy`                          | Required | `BackendUpdatePrivacySettingsInput`        | `BackendPrivacySettings`         |
|  16 | GET    | `/users/me/security`                         | Required | —                                          | `BackendSecuritySettings`        |
|  17 | POST   | `/users/me/security/email-change`            | Required | `BackendRequestEmailChangeInput`           | `BackendSecurityOperationResult` |
|  18 | PUT    | `/users/me/security/password`                | Required | `BackendChangePasswordInput`               | `BackendSecurityOperationResult` |
|  19 | POST   | `/users/me/security/two-factor/setup`        | Required | —                                          | `BackendTwoFactorSetup`          |
|  20 | POST   | `/users/me/security/two-factor/verify`       | Required | `{ code }`                                 | `BackendSecurityOperationResult` |
|  21 | POST   | `/users/me/security/two-factor/disable`      | Required | `{ code }`                                 | `BackendSecurityOperationResult` |
|  22 | DELETE | `/users/me/security/sessions/:sessionId`     | Required | —                                          | `BackendSecurityOperationResult` |
|  23 | DELETE | `/users/me/security/sessions`                | Required | —                                          | `BackendSecurityOperationResult` |
|  24 | GET    | `/users/me/preferences`                      | Required | —                                          | `BackendPreferences`             |
|  25 | PATCH  | `/users/me/preferences`                      | Required | `BackendUpdatePreferencesInput`            | `BackendPreferences`             |
|  26 | GET    | `/users/me/account`                          | Required | —                                          | `BackendAccount`                 |
|  27 | POST   | `/users/me/account/deactivation`             | Required | —                                          | `BackendAccount`                 |
|  28 | DELETE | `/users/me/account/deactivation`             | Required | —                                          | `BackendAccount`                 |
|  29 | GET    | `/users/me/courses`                          | Required | —                                          | `BackendCourseEnrollment[]`      |
|  30 | GET    | `/users/me/certificates`                     | Required | —                                          | `BackendCertificate[]`           |
|  31 | GET    | `/users/me/subscription`                     | Required | —                                          | `BackendSubscription \| null`    |
|  32 | PUT    | `/users/me/subscription/plan`                | Required | `{ plan }`                                 | `BackendSubscription`            |
|  33 | POST   | `/users/me/subscription/cancellation`        | Required | —                                          | `BackendSubscription`            |
|  34 | GET    | `/users/me/payment-methods`                  | Required | —                                          | `BackendPaymentMethod[]`         |
|  35 | DELETE | `/users/me/payment-methods/:paymentMethodId` | Required | —                                          | `boolean`                        |
|  36 | GET    | `/users/me/invoices`                         | Required | —                                          | `BackendInvoice[]`               |

### Relación con el frontend

La fuente de verdad es el **contrato de API `v1`**.

La relación es:

```text
BACKEND_API.md (este documento)
      ↓
Contrato REST
      ↓
src/lib/backend/types.ts
      ↓
Representación TypeScript del contrato
      ↓
RestBackendClient
```

Por tanto:

- Este documento (`BACKEND_API.md`) define el contrato.
- `src/lib/backend/types.ts` representa ese contrato en TypeScript.
- `RestBackendClient` implementa las llamadas al contrato.
- Los resolvers GraphQL consumen `BackendClient`, no conocen directamente los detalles de REST.

Los tipos `Backend*` **no son la fuente de verdad del contrato**.

---

# 11. Errores por endpoint

Todos los endpoints con `Required` pueden responder:

```text
401 UNAUTHENTICATED
```

cuando existe un problema con el Access Token.

Además:

| Endpoint                                   | Errores adicionales                                                                            |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `POST /auth/login`                         | `400`, `401` (credenciales), `422`, `429`, `500`, `503`                                        |
| `POST /auth/refresh`                       | `400` (solo mal formado), `401`/`403` (token inválido), `429`, `500`, `503`                    |
| `POST /auth/logout`                        | `400`, `401`, `500`. Debe ser idempotente cuando sea posible.                                  |
| `POST /auth/register`                      | `400`, `409` (email repetido), `422`, `429`, `500`, `503`                                      |
| `POST /auth/forgot-password`               | `400`, `422`, `429`, `500`, `503`                                                              |
| `POST /auth/validate-reset-token`          | `400` (`INVALID_RESET_TOKEN`), `429`, `500`, `503`                                             |
| `POST /auth/reset-password`                | `400` (token inválido), `422`, `429`, `500`, `503`                                             |
| `POST /contact`                            | `400`, `422`, `429`, `500`, `503`                                                              |
| `GET /users/:userId/profile`               | `404`                                                                                          |
| `PATCH /users/me/profile`                  | `422`                                                                                          |
| `PATCH /users/me/personal-data`            | `403` (identidad bloqueada), `409`, `422`                                                      |
| `PATCH /users/me/privacy`                  | `422`                                                                                          |
| `POST .../email-change`                    | `409` (correo ya en uso), `422`                                                                |
| `PUT .../security/password`                | `409` (la nueva es igual a la actual), `422` (`VALIDATION_ERROR` o `INVALID_CURRENT_PASSWORD`) |
| `POST .../two-factor/setup`                | `409` (2FA ya activo)                                                                          |
| `POST .../two-factor/verify`               | `409` (setup no iniciado o 2FA ya activo), `422` (`VALIDATION_ERROR` o `INVALID_CODE`)         |
| `POST .../two-factor/disable`              | `403` (2FA obligatorio para este usuario), `422` (`VALIDATION_ERROR` o `INVALID_CODE`)         |
| `DELETE .../sessions/:sessionId`           | `404`                                                                                          |
| `PATCH /users/me/preferences`              | `422` (idioma, tema o zona horaria no soportados)                                              |
| `POST /users/me/account/deactivation`      | `409` (la cuenta no está `active`)                                                             |
| `DELETE /users/me/account/deactivation`    | `409` (la cuenta no está `pending_deactivation`)                                               |
| `PUT /users/me/subscription/plan`          | `403`, `409` (incluye `PAYMENT_METHOD_REQUIRED`), `422`                                        |
| `POST /users/me/subscription/cancellation` | `404`, `409`                                                                                   |
| `DELETE /users/me/payment-methods/:id`     | `404`, `409` (por ejemplo, último método de una suscripción de pago activa)                    |

---

# 12. Qué hace cada capa

### Dashboard

El dashboard utiliza únicamente GraphQL.

```text
React → GraphQL → BFF → Backend
```

No llama al REST directamente.

### Sitio público

Auth.js utiliza:

```text
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

Los route handlers de Next.js utilizan:

```text
POST /auth/register
POST /auth/forgot-password
POST /auth/reset-password
POST /contact
```

Estos handlers deben aplicar la validación correspondiente antes de reenviar las peticiones.

### BFF GraphQL

El BFF:

- expone el contrato GraphQL;
- valida autenticación cuando corresponde;
- utiliza `BackendClient`;
- no debe acoplar los resolvers directamente a REST;
- debe interpretar los errores del backend mediante `error.code`;
- puede transformar errores REST a errores GraphQL;
- puede convertir comportamientos específicos como `404` de perfil público a `null`, según el contrato GraphQL;
- no debe depender de que exista un backend real para arrancar, renderizar o resolver operaciones cubiertas por el modo `mock` (sección 1.1).

### Backend principal

El backend es responsable de:

- autenticación;
- autorización;
- validación;
- reglas de negocio;
- persistencia;
- integraciones externas;
- seguridad;
- consistencia de datos.

El backend **no debe depender del BFF para aplicar seguridad**.

El backend **no es un requisito de arranque** para el frontend/BFF cuando el modo activo es `mock` (sección 1.1). El frontend/BFF debe poder iniciar, renderizar y resolver las operaciones cubiertas por el contrato sin que exista un backend disponible.

Cualquier cambio incompatible en este contrato debe coordinarse entre ambos lados antes de implementarse.

---

# 13. Historial de cambios

## v1

Contrato inicial formalizado para la integración entre el frontend/BFF y el backend.

Este contrato puede implementarse en dos modos equivalentes: `rest` (backend real) y `mock` (entorno controlado sin backend). Ver sección 1.1.

Incluye:

- nombres de campos en inglés;
- autenticación mediante Access Token y Refresh Token;
- rotación de Refresh Token;
- endpoints de autenticación;
- endpoints de usuario;
- perfil público con autenticación opcional;
- configuración de privacidad;
- seguridad y 2FA;
- sesiones;
- preferencias;
- cuenta y desactivación;
- cursos;
- certificados;
- suscripción;
- métodos de pago;
- facturas;
- contrato estándar de errores;
- códigos de dominio;
- reglas de actualización parcial;
- reglas de seguridad y autorización.

El contrato `v1` debe considerarse compartido entre frontend/BFF y backend.

Los cambios incompatibles deben generar una nueva versión del contrato.

---

# 14. Apéndice: migración desde el backend previo (histórico)

El backend previo usaba nombres de campos en español y una ruta distinta a la del contrato `v1`.

## 14.1 Nombres de campos

### Respuesta de `POST /auth/login` (dentro de `data`)

| Antes       | Ahora       |
| ----------- | ----------- |
| `nombre`    | `firstName` |
| `apellidos` | `lastName`  |
| `uuid`      | `id`        |
| `rol`       | `role`      |

Los demás campos no cambian: `subscription`, `image`, `token`, `refreshToken`, `expiresIn` y `refreshExpiresIn`.

### Cuerpo de `POST /auth/register`

| Antes        | Ahora       |
| ------------ | ----------- |
| `nombre`     | `firstName` |
| `apellidos`  | `lastName`  |
| `contrasena` | `password`  |

`email` no cambia.

## 14.2 Rutas

| Antes               | Ahora           |
| :------------------ | :-------------- |
| `POST /api/contact` | `POST /contact` |

## 14.3 Despliegue

Estos cambios **no son compatibles hacia atrás**.

El frontend y el backend deben desplegarse a la vez. El frontend rechaza una respuesta de login que no use los nombres nuevos, así que si solo se despliega uno de los dos nadie podrá iniciar sesión ni registrarse.

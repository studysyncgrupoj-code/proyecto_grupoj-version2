// Schema de los formularios de la sección Security
// (docs/backend-api/_rutas/users-me/security/*.md).
//
// Este archivo crece en 4.2, 4.3 y 4.4:
//   - 4.2: changePasswordFormSchema (contrato §3.8).
//   - 4.3: requestEmailChangeSchema (contrato §3.8).
//   - 4.4: twoFactorCodeSchema (contrato §3.8, regex `/^\d{6}$/`).
//
// Los mensajes son claves del namespace `Validation` (i18n),
// no texto final. `resolveError` los traduce.

import { confirmPasswordField, passwordField } from '@/lib/schemas/fields/auth';
import { z } from 'zod';

/* ============================================================
 * CHANGE PASSWORD (4.2)
 * ============================================================ */

/**
 * Schema del formulario de cambio de contraseña.
 *
 * Reglas del contrato §3.8 (`PUT /users/me/security/password`):
 *   - `currentPassword`: obligatoria, no vacía.
 *   - `newPassword`: mismas reglas que registro/reset
 *     (6-15 chars, mayúscula + minúscula + especial). Reutiliza
 *     `passwordField` de `fields/auth.ts`.
 *   - `newPassword !== currentPassword` → 409 CONFLICT. Se valida
 *     en el cliente para dar feedback inmediato; el backend
 *     también lo rechaza.
 *
 * `confirmPassword` es cliente-only: se usa para reducir errores
 * de tipeo. Nunca se envía al backend (se descarta en el componente
 * antes de llamar a `mutate`).
 */
export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'password.required'),
    newPassword: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'confirmPassword.mismatch',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'security.changePassword.sameAsCurrent',
    path: ['newPassword'],
  });

export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>;

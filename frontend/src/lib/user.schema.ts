import { z } from 'zod';

// ============================================
// CONSTANTES COMPARTIDAS
// ============================================
const nameRegex = /^[\p{L}\s'\-\.]+$/u;
const passwordMinLength = 6;
const passwordMaxLength = 15;
const emailMaxLength = 254;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~])/;

// ============================================
// ESQUEMAS BASE
// ============================================

const nameField = z
  .string()
  .trim()
  .min(1, 'name.required')
  .min(2, 'name.min')
  .max(100, 'name.max')
  .refine((val) => nameRegex.test(val), { message: 'name.invalid' });

const lastNameField = z
  .string()
  .trim()
  .min(1, 'lastName.required')
  .min(2, 'lastName.min')
  .max(100, 'lastName.max')
  .refine((val) => nameRegex.test(val), { message: 'lastName.invalid' });

const emailField = z
  .string()
  .trim()
  .min(1, 'email.required')
  .max(emailMaxLength, 'email.max')
  .email('email.invalid');

const passwordField = z
  .string()
  .min(1, 'password.required')
  .min(passwordMinLength, 'password.min')
  .max(passwordMaxLength, 'password.max')
  .refine((val) => passwordRegex.test(val), { message: 'password.invalid' });

const confirmPasswordField = z.string().min(1, 'confirmPassword.required');

// ============================================
// SCHEMAS PRINCIPALES
// ============================================

export const registerSchema = z.object({
  name: nameField,
  lastName: lastNameField,
  email: emailField,
  password: passwordField,
});

export const registerWithConfirmSchema = registerSchema
  .extend({
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'confirmPassword.mismatch',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'password.required'),
});

export const updateUserSchema = z.object({
  name: nameField.optional(),
  lastName: lastNameField.optional(),
  email: emailField.optional(),
  password: passwordField.optional(),
  active: z.boolean().optional(),
});

// Esquema dedicado para "Olvidé mi contraseña": únicamente exige un correo
// con formato válido. No reutiliza `emailField` porque este flujo requiere
// un mensaje de error específico y no debe acoplarse a las reglas de
// registro/login si estas cambian en el futuro.
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'email.required')
    .max(emailMaxLength, 'email.max')
    .email('email.invalidInput'),
});

// Esquema del formulario de "Restablecer contraseña": lo que captura el
// usuario en pantalla (contraseña + confirmación). El token NO forma parte
// de este esquema porque no es un campo editable por el usuario, sino un
// parámetro de la URL.
export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'confirmPassword.mismatch',
    path: ['confirmPassword'],
  });

// Esquema del payload que viaja al endpoint interno /api/auth/reset-password:
// el token (de la URL) junto con la nueva contraseña. `confirmPassword`
// nunca debe llegar aquí ni al backend externo.
export const resetPasswordRequestSchema = z.object({
  token: z.string().trim().min(1, 'resetPassword.invalidToken'),
  password: passwordField,
});

export const resetPasswordTokenSchema = z.object({
  token: z.string().trim().min(1, 'resetPassword.invalidToken'),
});

// ============================================
// TIPOS DERIVADOS
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterWithConfirmInput = z.infer<
  typeof registerWithConfirmSchema
>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>;
export type ResetPasswordTokenInput = z.infer<typeof resetPasswordTokenSchema>;

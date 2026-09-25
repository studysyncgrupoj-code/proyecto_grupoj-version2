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

const nombreField = z
  .string()
  .trim()
  .min(1, 'El nombre es requerido')
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede exceder los 100 caracteres')
  .refine((val) => nameRegex.test(val), {
    message:
      'El nombre solo puede contener letras, espacios, apóstrofes, guiones y puntos',
  });

const apellidoField = z
  .string()
  .trim()
  .min(1, 'El apellido es requerido')
  .min(2, 'El apellido debe tener al menos 2 caracteres')
  .max(100, 'El apellido no puede exceder los 100 caracteres')
  .refine((val) => nameRegex.test(val), {
    message:
      'El apellido solo puede contener letras, espacios, apóstrofes, guiones y puntos',
  });

// Validación de email moderna usando z.email() a nivel superior
const emailField = z
  .string()
  .trim()
  .min(1, 'El correo electrónico es requerido')
  .max(
    emailMaxLength,
    `El correo no puede exceder los ${emailMaxLength} caracteres`,
  )
  .email('Correo electrónico inválido')
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Correo electrónico inválido',
  });

const passwordField = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(
    passwordMinLength,
    `La contraseña debe tener al menos ${passwordMinLength} caracteres`,
  )
  .max(
    passwordMaxLength,
    `La contraseña no puede exceder los ${passwordMaxLength} caracteres`,
  )
  .refine((val) => passwordRegex.test(val), {
    message:
      'La contraseña debe contener al menos una letra minúscula, una mayúscula y un caracter especial',
  });

// ============================================
// SCHEMAS PRINCIPALES
// ============================================

export const registerSchema = z.object({
  nombre: nombreField,
  apellido: apellidoField,
  email: emailField,
  password: passwordField,
});

export const registerWithConfirmSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const updateUserSchema = z.object({
  nombre: nombreField.optional(),
  apellido: apellidoField.optional(),
  email: emailField.optional(),
  password: passwordField.optional(),
  activo: z.boolean().optional(),
});

// Esquema dedicado para "Olvidé mi contraseña": únicamente exige un correo
// con formato válido. No reutiliza `emailField` porque este flujo requiere
// un mensaje de error específico y no debe acoplarse a las reglas de
// registro/login si estas cambian en el futuro.
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es requerido')
    .max(
      emailMaxLength,
      `El correo no puede exceder los ${emailMaxLength} caracteres`,
    )
    .email('Ingresa un correo electrónico válido'),
});

// Esquema del formulario de "Restablecer contraseña": lo que captura el
// usuario en pantalla (contraseña + confirmación). El token NO forma parte
// de este esquema porque no es un campo editable por el usuario, sino un
// parámetro de la URL.
export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Esquema del payload que viaja al endpoint interno /api/auth/reset-password:
// el token (de la URL) junto con la nueva contraseña. `confirmPassword`
// nunca debe llegar aquí ni al backend externo.
export const resetPasswordRequestSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, 'El enlace de restablecimiento no es válido.'),
  password: passwordField,
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

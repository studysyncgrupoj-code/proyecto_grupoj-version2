import { z } from 'zod';

// ============================================
// CONSTANTES COMPARTIDAS
// ============================================
const nameRegex = /^[\p{L}\s'\-\.]+$/u;
const passwordMinLength = 6;
const passwordMaxLength = 15;
const emailMaxLength = 254;

// Regex para contraseña: al menos una minúscula, una mayúscula y un caracter especial
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~])/;

// ============================================
// ESQUEMAS BASE
// ============================================

const nombreField = z.string().superRefine((val, ctx) => {
  const trimmed = val?.trim() ?? '';

  if (trimmed === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El nombre es requerido',
    });
    return;
  }
  if (trimmed.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El nombre debe tener al menos 2 caracteres',
    });
  }
  if (trimmed.length > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El nombre no puede exceder los 100 caracteres',
    });
  }
  if (!nameRegex.test(trimmed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'El nombre solo puede contener letras, espacios, apóstrofes, guiones y puntos',
    });
  }
});

const apellidoField = z.string().superRefine((val, ctx) => {
  const trimmed = val?.trim() ?? '';

  if (trimmed === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El apellido es requerido',
    });
    return;
  }
  if (trimmed.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El apellido debe tener al menos 2 caracteres',
    });
  }
  if (trimmed.length > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El apellido no puede exceder los 100 caracteres',
    });
  }
  if (!nameRegex.test(trimmed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'El apellido solo puede contener letras, espacios, apóstrofes, guiones y puntos',
    });
  }
});

const emailField = z.string().superRefine((val, ctx) => {
  const trimmed = val?.trim() ?? '';

  if (trimmed === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El correo electrónico es requerido',
    });
    return;
  }
  if (trimmed.length > emailMaxLength) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El correo no puede exceder los 254 caracteres',
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Correo electrónico inválido',
    });
  }
});

const passwordField = z.string().superRefine((val, ctx) => {
  if (!val || val === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La contraseña es requerida',
    });
    return;
  }
  if (val.length < passwordMinLength) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `La contraseña debe tener al menos ${passwordMinLength} caracteres`,
    });
  }
  if (val.length > passwordMaxLength) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `La contraseña no puede exceder los ${passwordMaxLength} caracteres`,
    });
  }
  if (!passwordRegex.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'La contraseña debe contener al menos una letra minúscula, una mayúscula y un caracter especial',
    });
  }
});

// ============================================
// SCHEMAS PRINCIPALES
// ============================================

export const registerSchema = z.object({
  nombre: nombreField,
  apellido: apellidoField,
  email: emailField,
  password: passwordField,
  activo: z.boolean().default(true),
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

// ============================================
// TIPOS DERIVADOS
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterWithConfirmInput = z.infer<
  typeof registerWithConfirmSchema
>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

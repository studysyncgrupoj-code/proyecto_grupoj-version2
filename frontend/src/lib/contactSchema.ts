import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

const noHtmlSubject = /^[^<>{}]*$/;
const noHtmlMessage = /^[^<>]*$/;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(100, 'El nombre no puede superar los 100 caracteres.')
    .regex(/^[\p{L}\s'\-\.]+$/u, 'El nombre solo puede contener letras.'),

  email: z
    .string()
    .trim()
    .email('Ingresa un correo electrónico válido.')
    .max(254, 'El correo no puede superar los 254 caracteres.'),

  contactNumber: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || isValidPhoneNumber(val),
      'Ingresa un número de teléfono válido.',
    )
    .transform((val) => (val === '' ? undefined : val)),

  subject: z
    .string()
    .trim()
    .min(5, 'El asunto debe tener al menos 5 caracteres.')
    .max(150, 'El asunto no puede superar los 150 caracteres.')
    .regex(noHtmlSubject, 'El asunto contiene caracteres no permitidos.'),

  message: z
    .string()
    .trim()
    .min(20, 'El mensaje debe tener al menos 20 caracteres.')
    .max(2000, 'El mensaje no puede superar los 2000 caracteres.')
    .regex(noHtmlMessage, 'El mensaje contiene caracteres no permitidos.'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactFormInput = z.input<typeof contactSchema>;

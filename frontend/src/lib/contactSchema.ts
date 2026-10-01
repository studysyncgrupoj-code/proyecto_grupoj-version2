import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

const noHtmlSubject = /^[^<>{}]*$/;
const noHtmlMessage = /^[^<>]*$/;

// Los mensajes son claves del namespace `Validation`, no texto.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'contact.name.min')
    .max(100, 'contact.name.max')
    .regex(/^[\p{L}\s'\-\.]+$/u, 'contact.name.invalid'),

  email: z
    .string()
    .trim()
    .min(1, 'email.required')
    .email('email.invalidInput')
    .max(254, 'email.max'),

  contactNumber: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || isValidPhoneNumber(val),
      'contact.phone.invalid',
    )
    .transform((val) => (val === '' ? undefined : val))
    .optional(),

  subject: z
    .string()
    .trim()
    .min(5, 'contact.subject.min')
    .max(150, 'contact.subject.max')
    .regex(noHtmlSubject, 'contact.subject.invalid'),

  message: z
    .string()
    .trim()
    .min(20, 'contact.message.min')
    .max(2000, 'contact.message.max')
    .regex(noHtmlMessage, 'contact.message.invalid'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactFormInput = z.input<typeof contactSchema>;

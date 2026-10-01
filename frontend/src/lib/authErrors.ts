import { COMMON_ERROR_CODES } from './apiErrors';

// Códigos comunes + los propios de esta ruta.
export const RESET_PASSWORD_ERROR_CODES = [
  ...COMMON_ERROR_CODES,
  'invalidToken',
] as const;

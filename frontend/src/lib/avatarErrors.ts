export const AVATAR_ERROR_CODES = [
  'unauthenticated',
  'serverError',
  'invalidRequest',
  'missingFile',
  'unsupportedType',
  'fileTooLarge',
  'serviceUnavailable',
  'uploadFailed',
  'removeFailed',
] as const;

export type AvatarErrorCode = (typeof AVATAR_ERROR_CODES)[number];

export * from './chat';
export * from './google';
export * from './urls';

export const FACEBOOK_APP_ID = '275311629877038';

export const INVALID_PASSWORD = 'invalid_password';
export const AUTH_FAILURE = 'auth_failure';
export const AUTH_CHANGE_LOCKOUT = 'auth_change_lockout';
export const EMAIL_EXISTS = 'email_exists';
export const STAFF_RESTRICTED_ACTION = 'staff_restricted_action';

export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_SPECIAL_CHARACTERS = '#?!@$%^&*-';

export const MAX_MFA_RESENDS = 5;
export const MAX_MFA_ATTEMPTS = 5;

export const LOCKED_OUT_CHANGE_PASSWORD = 'locked_out_change_password';
export const LOCKED_OUT_CHANGE_EMAIL = 'locked_out_change_email';
const supportPhoneDigits = '8008216400';
const digitGroups = [
  supportPhoneDigits.slice(0, 3),
  supportPhoneDigits.slice(3, 6),
  supportPhoneDigits.slice(6),
];
export const SUPPORT_PHONE_NUMBER = digitGroups.join('-');
export const SUPPORT_PHONE_NUMBER_HREF = `tel:+1${supportPhoneDigits}`;
const supportEmail = 'clientservice@legalplans.com';
export const SUPPORT_EMAIL_HREF = `mailto:${supportEmail}`;
export const SUPPORT_EMAIL = supportEmail;

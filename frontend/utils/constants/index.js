export * from './chat';
export * from './google';
export * from './urls';

export const FACEBOOK_APP_ID = '275311629877038';

export const SUPPORT_PHONE_NUMBER = '800-821-6400';

export const INVALID_PASSWORD = 'invalid_password';
export const AUTH_FAILURE = 'auth_failure';
export const AUTH_CHANGE_LOCKOUT = 'auth_change_lockout';
export const EMAIL_EXISTS = 'email_exists';

export const MIN_PASSWORD_LENGTH = 8;

// This correlates to the score from zxcvbn, which can be 0-4, with 4 being the best.
export const MIN_PASSWORD_SCORE = 3;

export const PASSWORD_SCORE_WORDS = ['too short', 'weak', 'okay', 'good', 'strong'];

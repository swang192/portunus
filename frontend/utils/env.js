import getEnv from 'zg_utils/getEnv';

const keys = ['sentry_dsn', 'sentry_environment'];

export default getEnv(keys);

import axios from 'axios';
import Cookies from 'js-cookie';

import tokenFetcher from '@@/zg_utils/tokens';

const apiConfig = {
  baseURL: '/api/',
  responseType: 'json',
  headers: {
    'X-REQUESTED-WITH': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
};

const unauthenticatedAPI = axios.create(apiConfig);

const API = axios.create(apiConfig);

unauthenticatedAPI.interceptors.request.use(config => {
  config.headers['X-CSRFToken'] = Cookies.get('csrftoken');
  return config;
});

API.interceptors.request.use(async config => {
  config.headers['X-CSRFToken'] = Cookies.get('csrftoken');
  const accessToken = await tokenFetcher.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const setupCsrf = () => unauthenticatedAPI.get('set_csrf/');

export const register = payload => unauthenticatedAPI.post('auth/register/', payload);

export const login = payload => unauthenticatedAPI.post('auth/login/', payload);

export const logout = () => API.post('auth/logout/');

export const refresh = async () => unauthenticatedAPI.post('auth/token/refresh/');

export const resetPassword = payload => API.post('auth/password-reset/', payload);

export const sendNewUserEmail = payload => API.post('auth/send-new-user-email', payload);

export const completePasswordReset = payload => API.post('auth/password-reset/complete/', payload);

export const changeUserEmail = payload => API.post('auth/change-email/', payload);

export const changePassword = payload => API.post('auth/change-password/', payload);

export const getCurrentUserSettings = () => API.get('auth/users/settings/');

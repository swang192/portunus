import axios from 'axios';

const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000; // 4 min in ms

// TODO change this up once portunus is deployed.
const PORTUNUS_URL = 'https://dev.portunus.willing.com';

const defaultFetch = () =>
  axios({ method: 'post', url: `${PORTUNUS_URL}/api/auth/token/refresh/`, withCredentials: true });

const loginUrl = `${PORTUNUS_URL}/login`;

const defaultOnError = () => {
  const params = new URLSearchParams();
  params.append('next', window.location.href);
  window.location.replace(`${loginUrl}?${params.toString()}`);
};

class TokenFetcher {
  constructor() {
    this.fetchFunction = defaultFetch;
    this.onError = defaultOnError;
    this.onSuccess = () => null;
    this.accessToken = '';
    this.timerId = null;
  }

  defaultOnError(_) {
    window.location.replace(loginUrl);
  }

  async fetchToken() {
    try {
      const response = await this.fetchFunction();
      this.accessToken = response.data.access;
      return true;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.clearToken();
        }
      }
      this.onError(error);
    }
    return false;
  }

  clearToken() {
    this.accessToken = '';
    clearInterval(this.timerId);
    this.timerId = null;
  }

  start(fetchFn, onSuccess, onError) {
    this.fetchFunction = fetchFn || this.fetchFunction;
    this.onSuccess = onSuccess || this.onSuccess;
    this.onError = onError || this.onError;
    if (!this.timerId) {
      if (this.fetchToken()) {
        this.timerId = setInterval(this.fetchToken, TOKEN_REFRESH_INTERVAL);
      }
    }
  }
}

const tokenFetcher = new TokenFetcher();

const isLoggedIn = () => {
  // NOTE this will only be guaranteed to be up-to-date if the tokenFetcher is started on
  // every page load.
  return Bool(tokenFetcher.accessToken);
};

export { tokenFetcher, isLoggedIn };

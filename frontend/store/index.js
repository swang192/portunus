import { makeAutoObservable } from 'mobx';

import tokenFetcher from 'zg_utils/tokens';
import * as api from 'utils/API';

class Store {
  showNavBar = true;

  loading = true;

  authenticated = false;

  onSuccess = token => {
    this.authenticated = Boolean(token);
    this.loading = false;
  };

  onError = () => {
    this.authenticated = false;
    this.loading = false;
    tokenFetcher.clearToken();
  };

  startFetching() {
    tokenFetcher.start('', api.refresh, this.onSuccess, this.onError);
  }

  constructor() {
    makeAutoObservable(this);
    const isSsr = typeof window === 'undefined';
    if (!isSsr) {
      this.startFetching();
    }
  }

  login() {
    this.authenticated = true;
    this.startFetching();
  }
}

export default Store;

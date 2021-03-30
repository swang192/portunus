import { makeAutoObservable } from 'mobx';

import tokenFetcher from 'zg_utils/tokens';
import * as api from 'utils/API';
import UserStore from './user';

class Store {
  showNavBar = true;

  loading = true;

  authenticated = false;

  ephemeralMfaToken = null;

  mfaMethod = null;

  loginEmail = null;

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
    this.user = new UserStore();
  }

  login() {
    this.authenticated = true;
    this.startFetching();
  }
}

export default Store;

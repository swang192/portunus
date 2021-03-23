import { makeAutoObservable } from 'mobx';

import { getCurrentUserSettings } from 'utils/API';

class UserStore {
  loading = false;

  error = false;

  email = null;

  constructor() {
    makeAutoObservable(this);
  }

  *loadUserData() {
    if (this.loading) {
      return;
    }
    this.error = false;
    this.loading = true;
    try {
      const { data } = yield getCurrentUserSettings();
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
    } catch {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}

export default UserStore;

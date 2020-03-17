import { AuthenticationActionCreator } from './auth-action-creator';
import { AuthenticationState } from '../user-authentication';
import { FluxStore } from 'fourspace-flux-ts';

/**
 * Login service from persisted credentials
 */
export interface PersistentLoginService {
  persistentLogin(): void;
}

export class FluxPersistentLoginService implements PersistentLoginService {
  private _store: FluxStore<AuthenticationState>;
  private _actionCreator: AuthenticationActionCreator;

  constructor(store: FluxStore<AuthenticationState>, actionCreator: AuthenticationActionCreator) {
    this._store = store;
    this._actionCreator = actionCreator;
  }

  public persistentLogin(): void {
    // get credentials
    const authState = this._store.getData();
    if (authState && authState.isAuthorized && authState.userCredentials != null) {
      this._actionCreator.performLogin(authState.userCredentials);
    }
  }
}

import { SubscribableDispatcher, EmitterImpl, FluxStore, AbstractDispatcherStore } from 'fourspace-flux-ts';
import { AuthenticationState } from '../user-authentication';
import { AuthenticationStore } from './auth-store';
import { AuthenticationAction } from './flux-actions';
import { handleAuthAction } from './auth-action-handler';

export class AuthenticationStoreImpl<U> extends AbstractDispatcherStore<AuthenticationAction<U>, AuthenticationState<U>>
  implements AuthenticationStore {
  private _userAuthentication: AuthenticationState<U>;

  constructor(
    dispatcher: SubscribableDispatcher<AuthenticationAction<U>>,
    baseState: AuthenticationState<U> = { isAuthorized: false, actionState: {} },
  ) {
    super('AuthStore', dispatcher, new EmitterImpl());
    this._userAuthentication = baseState;
  }

  public getState(): AuthenticationState<U> {
    return this._userAuthentication;
  }

  public generateChange(action: AuthenticationAction<U>): boolean {
    const oldState = this._userAuthentication;
    const newState = handleAuthAction(oldState, action);
    if (oldState !== newState) {
      this._userAuthentication = newState;
      return true;
    }
    return false;
  }

  public doHandle(payload: AuthenticationAction<U>): boolean {
    return true;
  }
}

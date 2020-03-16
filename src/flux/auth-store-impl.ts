import { SubscribableDispatcher, EmitterImpl, FluxStore, AbstractDispatcherStore } from 'fourspace-flux-ts';
import { AuthenticationState } from '../user-authentication';
import { AuthenticationStore } from './auth-store';
import { AuthenticationAction } from './flux-actions';
import { handleAuthAction } from './auth-action-handler';

export class AuthenticationStoreImpl extends AbstractDispatcherStore<AuthenticationAction, AuthenticationState>
  implements AuthenticationStore {
  private _userAuthentication: AuthenticationState;

  constructor(dispatcher: SubscribableDispatcher<AuthenticationAction>) {
    super('AuthStore', dispatcher, new EmitterImpl());
    this._userAuthentication = { isAuthorized: false, actionState: {} };
  }

  public getData(): AuthenticationState {
    return this._userAuthentication;
  }

  public generateChange(action: AuthenticationAction): boolean {
    const oldState = this._userAuthentication;
    const newState = handleAuthAction(oldState, action);
    if (oldState !== newState) {
      this._userAuthentication = newState;
      return true;
    }
    return false;
  }

  public doHandle(payload: AuthenticationAction): boolean {
    return true;
  }
}

import { Dispatcher, EmitAllEventEmitter, DispatcherUpdateStore, Store } from 'fourspace-flux-ts';
import { UserAuthentication, AuthenticationPayload } from '../definitions/user-authentication';
import { Logger, LogFactory } from 'fourspace-logger-ts';

const LOGGER: Logger = LogFactory.getLogger('authorization-store');

export interface AuthorizationStore extends Store<UserAuthentication, UserAuthentication> {}

export class AuthorizationStoreImpl
  extends DispatcherUpdateStore<AuthenticationPayload, UserAuthentication, UserAuthentication>
  implements AuthorizationStore {
  private _userAuthentication: UserAuthentication;

  constructor(dispatcher: Dispatcher<AuthenticationPayload>) {
    super('AuthStore', dispatcher, new EmitAllEventEmitter<UserAuthentication>());
    this._userAuthentication = { isAuthorized: false };
  }

  public getStoreData(): UserAuthentication {
    return this._userAuthentication;
  }

  public generateChange(payload: AuthenticationPayload): UserAuthentication {
    if (payload.pendingLogin) {
      this._userAuthentication = { isAuthorized: false, isPendingLogin: true };
    } else {
      if (payload.userAuthentication) {
        this._userAuthentication = payload.userAuthentication;
      }
      if (payload.invalidate) {
        if (this._userAuthentication == null) {
          this._userAuthentication = { isAuthorized: false };
        }
        this._userAuthentication.isAuthorized = false;
        this._userAuthentication.isPendingLogin = false;
      }
    }
    return this._userAuthentication;
  }

  public doHandle(payload: AuthenticationPayload): boolean {
    return true;
  }
}

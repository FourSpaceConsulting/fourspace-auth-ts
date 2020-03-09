import { Dispatcher, EmitAllEventEmitter, DispatcherUpdateStore } from 'fourspace-flux-ts';
import { UserAuthentication, AuthenticationPayload } from '../definitions/user-authentication';

export class AuthorizationStore extends DispatcherUpdateStore<
  AuthenticationPayload,
  UserAuthentication,
  UserAuthentication
> {
  private _userAuthentication: UserAuthentication;

  constructor(dispatcher: Dispatcher<AuthenticationPayload>) {
    super('AuthStore', dispatcher, new EmitAllEventEmitter<UserAuthentication>());
    this._userAuthentication = { isAuthorized: false };
  }

  public getStoreData(): UserAuthentication {
    return this._userAuthentication;
  }

  public generateChange(payload: AuthenticationPayload): UserAuthentication {
    if (payload.invalidate) {
      this._userAuthentication.isAuthorized = false;
    }
    if (payload.userAuthentication) {
      this._userAuthentication = payload.userAuthentication;
    }
    return this._userAuthentication;
  }

  public doHandle(payload: AuthenticationPayload): boolean {
    return true;
  }
}

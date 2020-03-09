import { Dispatcher } from 'fourspace-flux-ts';
import { UserAuthentication, AuthenticationPayload } from '../definitions/user-authentication';
import { UserAuthenticator } from '../definitions/user-authenticator';

export class AuthenticationActionCreator {
  private _authDispatcher: Dispatcher<AuthenticationPayload>;
  private _userAuthenticator: UserAuthenticator;

  constructor(authDispatcher: Dispatcher<AuthenticationPayload>, userAuthenticator: UserAuthenticator) {
    this._authDispatcher = authDispatcher;
    this._userAuthenticator = userAuthenticator;
  }

  public async performLogin(user: string, credentialType: string, credential: string): Promise<UserAuthentication> {
    const auth = await this._userAuthenticator.authenticate(user, credentialType, credential);
    this._onAuthentication(auth);
    return auth;
  }

  public performLogout(): void {
    this._authDispatcher.dispatch({ userAuthentication: { isAuthorized: false, user: null, credential: null } });
  }

  public invalidateAuthorization(): void {
    this._authDispatcher.dispatch({ invalidate: true });
  }

  private _onAuthentication(userAuthentication: UserAuthentication): void {
    this._authDispatcher.dispatch({ userAuthentication });
  }
}

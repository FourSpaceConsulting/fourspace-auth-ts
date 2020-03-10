import { Dispatcher } from 'fourspace-flux-ts';
import { UserAuthentication, UserCredentials, AuthenticationPayload } from '../definitions/user-authentication';
import { UserAuthenticator } from '../definitions/user-authenticator';

export interface AuthenticationActionCreator {
  performLogin(userCredentials: UserCredentials): Promise<UserAuthentication>;
  performLogout(): void;
  invalidateAuthorization(): void;
}

export class AuthenticationActionCreatorImpl implements AuthenticationActionCreator {
  private _authDispatcher: Dispatcher<AuthenticationPayload>;
  private _userAuthenticator: UserAuthenticator;

  constructor(authDispatcher: Dispatcher<AuthenticationPayload>, userAuthenticator: UserAuthenticator) {
    this._authDispatcher = authDispatcher;
    this._userAuthenticator = userAuthenticator;
  }

  public async performLogin(userCredentials: UserCredentials): Promise<UserAuthentication> {
    const auth = await this._userAuthenticator.authenticate(userCredentials);
    this._onAuthentication(auth);
    return auth;
  }

  public performLogout(): void {
    this._authDispatcher.dispatch({ userAuthentication: { isAuthorized: false, userCredentials: null } });
  }

  public invalidateAuthorization(): void {
    this._authDispatcher.dispatch({ invalidate: true });
  }

  private _onAuthentication(userAuthentication: UserAuthentication): void {
    this._authDispatcher.dispatch({ userAuthentication });
  }
}

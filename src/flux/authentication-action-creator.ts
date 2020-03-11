import { Dispatcher } from 'fourspace-flux-ts';
import { UserAuthentication, UserCredentials, AuthenticationPayload } from '../definitions/user-authentication';
import { UserAuthenticator } from '../definitions/user-authenticator';

export interface AuthenticationActionCreator {
  performLogin(userCredentials: UserCredentials): Promise<UserAuthentication>;
  persistentLogin(): void;
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

  /**
   * this should be overridden for relevant storage technology (e.g. mobile token, web cookies)
   * default behaviour is to do nothing (i.e. there is no stored auth info)
   */
  public persistentLogin(): void {
    return;
  }

  public async performLogin(userCredentials: UserCredentials): Promise<UserAuthentication> {
    this._authDispatcher.dispatch({ pendingLogin: true });
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

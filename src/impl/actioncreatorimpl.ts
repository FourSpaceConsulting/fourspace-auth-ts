import { Dispatcher } from 'fourspace-flux-ts';
import { UserAuthentication, UserCredentials, AuthenticationPayload } from '../user-authentication';
import { UserAuthenticator } from '../user-authenticator';
import { AuthenticationActionCreator } from '../auth-actioncreator';

type LogoutFunctor = () => Promise<void>;

export class AuthenticationActionCreatorImpl implements AuthenticationActionCreator {
  private readonly _authDispatcher: Dispatcher<AuthenticationPayload>;
  private readonly _userAuthenticator: UserAuthenticator;
  private readonly _logoutFunctor: LogoutFunctor;

  constructor(
    authDispatcher: Dispatcher<AuthenticationPayload>,
    userAuthenticator: UserAuthenticator,
    logoutFunctor: LogoutFunctor = null,
  ) {
    this._authDispatcher = authDispatcher;
    this._userAuthenticator = userAuthenticator;
    this._logoutFunctor = logoutFunctor;
  }

  public pendingLogin() {
    this._authDispatcher.dispatch({
      userAuthentication: { isPendingLogin: true, isAuthorized: false, userCredentials: null },
    });
  }

  public cancelPendingLogin() {
    this._authDispatcher.dispatch({
      userAuthentication: { isPendingLogin: false, isAuthorized: false, userCredentials: null },
    });
  }

  public async performLogin(userCredentials: UserCredentials): Promise<UserAuthentication> {
    const auth = await this._userAuthenticator.authenticate(userCredentials);
    this._onAuthentication(auth);
    return auth;
  }

  public async performLogout(): Promise<void> {
    if (this._logoutFunctor != null) {
      await this._logoutFunctor();
    }
    this._authDispatcher.dispatch({ userAuthentication: { isAuthorized: false, userCredentials: null } });
  }

  public invalidateAuthorization(): void {
    this._authDispatcher.dispatch({ invalidate: true });
  }

  private _onAuthentication(userAuthentication: UserAuthentication): void {
    this._authDispatcher.dispatch({ userAuthentication });
  }
}

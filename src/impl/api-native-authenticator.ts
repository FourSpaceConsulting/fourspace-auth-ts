import { LogFactory } from 'fourspace-logger-ts';
import { UserAuthenticator } from '../user-authenticator';
import { UserCredentials, LogoutInfo, LogInCredentials } from '../user-authentication';
import { AuthUserService } from '../auth-service';
import { TokenManager } from '../token';

const LOGGER = LogFactory.getLogger('api-user-authenticator');

export class ApiNativeAuthenticator<U> implements UserAuthenticator<U> {
  private _userService: AuthUserService<U>;
  private _tokenManager: TokenManager;
  private _loginCredentialType: string;

  constructor(userService: AuthUserService<U>, tokenManager: TokenManager, loginCredentialType: string) {
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._loginCredentialType = loginCredentialType;
  }

  public async logout(logoutInfo: LogoutInfo): Promise<void> {
    const unexpired = this._tokenManager.getUnexpiredToken();
    if (unexpired?.token != null) {
      // logout user
      await this._userService.logout(unexpired.token);
    }
    // remove tokens
    this._tokenManager.removeTokens();
  }

  public async authenticate(userCredentials: UserCredentials): Promise<U> {
    let accessToken = userCredentials.credential;
    if (this._loginCredentialType === userCredentials.credentialType) {
      // log in to start a user token session, and save the tokens
      const credential = userCredentials.credential as LogInCredentials;
      const tokens = await this._userService.loginWithUserId(
        credential.userId,
        credential.password,
        credential.remember,
      );
      this._tokenManager.setTokenFromResponse(tokens);
      accessToken = tokens.accessToken;
    }
    // get the user with the token
    return this._userService.getUserDetails(accessToken);
  }
}

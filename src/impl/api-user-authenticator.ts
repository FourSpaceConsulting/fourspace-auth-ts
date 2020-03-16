import * as Request from 'superagent';
import { LogFactory } from 'fourspace-logger-ts';
import { UserAuthenticator } from '../user-authenticator';
import { UserCredentials, AuthenticatedUser, LogoutInfo } from '../user-authentication';
import { AuthenticationUriProvider } from '../uri-provider';

const LOGGER = LogFactory.getLogger('api-user-authenticator');

export class ApiUserAuthenticator implements UserAuthenticator {
  private readonly authUri: AuthenticationUriProvider;

  constructor(authUri: AuthenticationUriProvider) {
    this.authUri = authUri;
  }

  public logout(logoutInfo: LogoutInfo): Promise<void> {
    // TODO implement the logout
    return Promise.resolve();
  }

  public authenticate(userCredentials: UserCredentials): Promise<AuthenticatedUser> {
    return new Promise<AuthenticatedUser>((resolve, reject) => {
      Request.post(this.authUri.authenticateUri)
        .send({
          username: userCredentials.userId,
          credentialType: userCredentials.credentialType,
          credentials: userCredentials.credential,
        })
        .then(
          (authData: Request.Response) => {
            if (LOGGER.isDebugEnabled()) {
              LOGGER.debug('Received authentication data', authData.body);
            }
            const au: AuthenticatedUser = authData.body;
            resolve(au);
          },
          (error: { status: number; response: Request.Response }) => {
            if (LOGGER.isDebugEnabled()) {
              LOGGER.debug('Error authorizing user', JSON.stringify(error));
            }
            reject({
              userCredentials,
              loginMessage: error.response.text,
            });
          },
        );
    });
  }
}

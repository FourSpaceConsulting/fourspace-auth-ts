import * as Request from 'superagent';
import { LogFactory } from 'fourspace-logger-ts';
import { UserAuthenticator } from '../user-authenticator';
import { UserAuthentication, UserCredentials, AuthenticatedUser } from '../user-authentication';
import { AuthenticationUriProvider } from '../uri-provider';

const LOGGER = LogFactory.getLogger('api-user-authenticator');

export class ApiUserAuthenticator implements UserAuthenticator {
  private readonly authUri: AuthenticationUriProvider;

  constructor(authUri: AuthenticationUriProvider) {
    this.authUri = authUri;
  }

  public authenticate(userCredentials: UserCredentials): Promise<UserAuthentication> {
    return new Promise<UserAuthentication>(resolve => {
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
            resolve({
              isAuthorized: true,
              isPendingLogin: false,
              isPendingLogout: false,
              userCredentials,
              authenticatedUser: au,
              token: au.userToken,
              timestamp: au.userTokenDate,
            });
          },
          (error: { status: number; response: Request.Response }) => {
            if (LOGGER.isDebugEnabled()) {
              LOGGER.debug('Error authorizing user', JSON.stringify(error));
            }
            resolve({
              isPendingLogin: false,
              isPendingLogout: false,
              isAuthorized: false,
              loginFailed: true,
              userCredentials,
              loginMessage: error.response.text,
            });
          },
        );
    });
  }
}

import * as Request from 'superagent';
import { LogFactory } from 'fourspace-logger-ts';
import { UserAuthenticator } from '../definitions/user-authenticator';
import { UserAuthentication, UserCredentials, AuthenticatedUser } from '../definitions/user-authentication';
import { AuthenticationUri } from '../definitions/authentication-uri';

const LOGGER = LogFactory.getLogger('api-user-authenticator');

export class ApiUserAuthenticator implements UserAuthenticator {
  private readonly authUri: AuthenticationUri;

  constructor(authUri: AuthenticationUri) {
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
            resolve({ isAuthorized: false, loginFailed: true, userCredentials, loginMessage: error.response.text });
          },
        );
    });
  }
}

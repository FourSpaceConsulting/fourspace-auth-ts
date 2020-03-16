import { UserAuthenticator } from '../user-authenticator';
import { UserCredentials, AuthenticatedUser } from '../user-authentication';
import { isEqual } from 'lodash';

export class InMemoryUserAuthenticator implements UserAuthenticator {
  private _userMap: Map<string, { credential: any; user: AuthenticatedUser }>;
  private _delay: number;
  private _errorMessage: string;

  constructor(
    userMap: Map<string, { credential: any; user: AuthenticatedUser }>,
    errorMessage: string,
    delay: number = 0,
  ) {
    this._userMap = userMap;
    this._errorMessage = errorMessage;
    this._delay = delay;
  }

  public authenticate(userCredentials: UserCredentials): Promise<AuthenticatedUser> {
    const userId = userCredentials.userId;
    const credential = userCredentials.credential;
    const entry = this._userMap.get(userId);
    if (entry != null && isEqual(entry.credential, credential)) {
      return new Promise<AuthenticatedUser>(resolve => {
        setTimeout(() => {
          resolve(entry.user);
        }, this._delay);
      });
    } else {
      return Promise.reject({
        userCredentials,
        loginMessage: this._errorMessage,
      });
    }
  }

  public logout(): Promise<void> {
    // do nothing
    return Promise.resolve();
  }
}

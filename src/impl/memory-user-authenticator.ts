import { UserAuthenticator } from '../user-authenticator';
import { LogInCredentials, UserCredentials } from '../user-authentication';
import { isEqual } from 'lodash';

export class InMemoryUserAuthenticator<U> implements UserAuthenticator<U> {
  private _userMap: Map<string, { credential: any; user: U }>;
  private _delay: number;
  private _errorMessage: string;

  constructor(
    userMap: Map<string, { credential: any; user: U }>,
    errorMessage: string,
    delay: number = 0,
  ) {
    this._userMap = userMap;
    this._errorMessage = errorMessage;
    this._delay = delay;
  }

  public authenticate(userCredentials: UserCredentials): Promise<U> {
    const credential = userCredentials.credential as LogInCredentials;
    const entry = this._userMap.get(credential.userId);
    if (entry != null && isEqual(entry.credential, credential.password)) {
      return new Promise<U>(resolve => {
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

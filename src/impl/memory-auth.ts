import { UserAuthenticator } from '../user-authenticator';
import { UserCredentials, UserAuthentication } from '../user-authentication';

export class InMemoryUserAuthenticator implements UserAuthenticator {
  private _userMap: { [key: string]: string };
  private _delay: number;

  constructor(userMap: { [key: string]: string }, delay: number = 0) {
    this._userMap = userMap;
    this._delay = delay;
  }

  public authenticate(userCredentials: UserCredentials): Promise<UserAuthentication> {
    let auth: UserAuthentication;
    const userId = userCredentials.userId;
    const password = userCredentials.credential;
    if (this._userMap[userId] && this._userMap[userId] === password) {
      auth = { isAuthorized: true, userCredentials };
    } else {
      auth = { isAuthorized: false, loginFailed: true, userCredentials };
    }
    return new Promise<UserAuthentication>(resolve => {
      setTimeout(() => {
        resolve(auth);
      }, this._delay);
    });
  }
}

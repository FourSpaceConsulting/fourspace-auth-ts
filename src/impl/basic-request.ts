import { LogFactory } from 'fourspace-logger-ts';

import { RequestAuthenticator } from '../request-authenticator';

const LOGGER = LogFactory.getLogger('request-basic-authenticator');

interface RequestLike {
  auth(user: string, pwd: string, options: { type: string }): this;
}
/**
 * Basic request authenticator
 * Updates a request with basic auth info from user authentication object
 */
export class BasicRequestAuthenticator<R extends RequestLike> implements RequestAuthenticator<R> {
  private readonly _userId: string;
  private readonly _password: string;

  constructor(userId: string, password: string) {
    this._userId = userId;
    this._password = password;
  }

  public authorizeRequest(request: R): R {
    if (LOGGER.isDebugEnabled) {
      LOGGER.debug('Authorizing request');
    }
    return request.auth(this._userId, this._password, {
      type: 'basic',
    });
  }
}

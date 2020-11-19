import { LogFactory } from 'fourspace-logger-ts';

import { RequestAuthenticator } from '../request-authenticator';
import { TokenProvider } from '../token-provider';
import { isPromise } from '../util';

const LOGGER = LogFactory.getLogger('request-token-authenticator');
interface RequestLike {
  set(field: string, val: string): this;
}

export class TokenRequestAuthenticator<R extends RequestLike> implements RequestAuthenticator<R> {
  private _tokenProvider: TokenProvider;

  constructor(tokenProvider: TokenProvider) {
    this._tokenProvider = tokenProvider;
  }

  public authorizeRequest(request: R): R | Promise<R> {
    if (LOGGER.isDebugEnabled) {
      LOGGER.debug('Authorizing request');
    }
    const tokenResponse = this._tokenProvider.authorizationToken();
    if (tokenResponse == null) {
      return request;
    }
    return isPromise(tokenResponse)
      ? (tokenResponse as Promise<string>).then(r => (r == null ? request : request.set('Authorization', r)))
      : request.set('Authorization', tokenResponse as string);
  }
}

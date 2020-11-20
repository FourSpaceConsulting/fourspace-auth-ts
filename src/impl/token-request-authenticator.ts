import { LogFactory } from 'fourspace-logger-ts';

import { RequestAuthenticator } from '../request-authenticator';
import { TokenProvider } from '../token-provider';

const LOGGER = LogFactory.getLogger('request-token-authenticator');

interface RequestLike {
  set(field: string, val: string): this;
}

export class TokenRequestAuthenticator<R extends RequestLike> implements RequestAuthenticator<R> {
  private _tokenProvider: TokenProvider;

  constructor(tokenProvider: TokenProvider) {
    this._tokenProvider = tokenProvider;
  }

  public async authorizeRequest(request: R): Promise<R> {
    if (LOGGER.isDebugEnabled) {
      LOGGER.debug('Authorizing request');
    }
    const tokenResponse = await this._tokenProvider.authorizationToken();
    if (tokenResponse == null) {
      return request;
    }
    return setAuthorizationHeader(request, tokenResponse);
  }
}

export function setAuthorizationHeader<R extends RequestLike>(request: R, value: string) {
  return request.set('Authorization', value);
}
import * as Request from 'superagent';
import { LogFactory } from 'fourspace-logger-ts';

import { AuthenticationState } from '../user-authentication';
import { RequestAuthenticator } from '../request-authenticator';
import { TokenProvider } from '../token-provider';

const LOGGER = LogFactory.getLogger('request-token-authenticator');

export class TokenRequestAuthenticator implements RequestAuthenticator<Request.SuperAgentRequest> {
  private _authentication: AuthenticationState;
  private _tokenProvider: TokenProvider;

  constructor(authentication: AuthenticationState, tokenProvider: TokenProvider) {
    this._authentication = authentication;
    this._tokenProvider = tokenProvider;
  }

  public updateAuthentication(authentication: AuthenticationState): void {
    if (LOGGER.isDebugEnabled()) {
      LOGGER.debug('Updating authentication');
    }
    this._authentication = authentication;
  }

  public authorizeRequest(request: Request.SuperAgentRequest): Request.SuperAgentRequest {
    if (LOGGER.isDebugEnabled) {
      LOGGER.debug('Authorizing request');
    }
    if (!this._authentication.isAuthorized) {
      return request;
    }
    const token = this._tokenProvider.authorizationToken(this._authentication);

    return request.auth(token, { type: 'bearer' });
  }
}

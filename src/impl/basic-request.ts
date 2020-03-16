﻿import * as Request from 'superagent';
import { LogFactory } from 'fourspace-logger-ts';

import { AuthenticationState } from '../user-authentication';
import { RequestAuthenticator } from '../request-authenticator';

const LOGGER = LogFactory.getLogger('request-basic-authenticator');

/**
 * Basic request authenticator
 * Updates a superagent request with basic auth info from user authentication object
 */
export class BasicRequestAuthenticator implements RequestAuthenticator<Request.SuperAgentRequest> {
  private _authentication: AuthenticationState;

  constructor(authentication: AuthenticationState) {
    this._authentication = authentication;
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
    return request.auth(this._authentication.userCredentials.userId, this._authentication.userCredentials.credential, {
      type: 'basic',
    });
  }
}

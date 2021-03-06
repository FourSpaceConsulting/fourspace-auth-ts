﻿import { Dispatcher } from 'fourspace-flux-ts';
import { UserCredentials, LogoutInfo } from '../user-authentication';
import { UserAuthenticator } from '../user-authenticator';
import { AuthenticationActionCreator } from './auth-action-creator';
import {
  AuthenticationAction,
  START_LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  START_LOGOUT,
  LOGGED_OUT,
} from './flux-actions';

export class AuthenticationActionCreatorImpl<U> implements AuthenticationActionCreator {
  private readonly _authDispatcher: Dispatcher<AuthenticationAction<U>>;
  private readonly _userAuthenticator: UserAuthenticator<U>;

  constructor(authDispatcher: Dispatcher<AuthenticationAction<U>>, userAuthenticator: UserAuthenticator<U>) {
    this._authDispatcher = authDispatcher;
    this._userAuthenticator = userAuthenticator;
  }

  public async performLogin(userCredentials: UserCredentials): Promise<void> {
    // dispatch login start
    this._authDispatcher.dispatch({ type: START_LOGIN });
    // log in asynchronously
    try {
      const authenticatedUser = await this._userAuthenticator.authenticate(userCredentials);
      // dispatch the login success
      this._authDispatcher.dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          userCredentials,
          authenticatedUser,
        },
      });
    } catch (error) {
      // dispatch the login failure
      this._authDispatcher.dispatch({
        type: LOGIN_FAILURE,
        payload: {
          userCredentials,
          failureReason: error.message,
        },
      });
    }
  }

  public async performLogout(logoutInfo: LogoutInfo): Promise<void> {
    // dispatch logout start
    this._authDispatcher.dispatch({ type: START_LOGOUT });
    // perform logout
    try {
      await this._userAuthenticator.logout(logoutInfo);
    } finally {
      // dispatch logout
      this._authDispatcher.dispatch({ type: LOGGED_OUT });
    }
  }

  public invalidateAuthorization(): Promise<void> {
    // dispatch logout
    this._authDispatcher.dispatch({ type: LOGGED_OUT });
    //
    return Promise.resolve();
  }
}

import { AuthenticatedUser, UserCredentials } from '../user-authentication';

// Start login
export const START_LOGIN = 'auth/start-login';
export interface StartLoginAction {
  type: 'auth/start-login';
}

// Login success
export const LOGIN_SUCCESS = 'auth/login-sucess'; // with credentials, token etc.
export interface LoginSuccessAction {
  type: 'auth/login-sucess';
  payload: LoginSuccessPayload;
}
export interface LoginSuccessPayload {
  userCredentials: UserCredentials;
  authenticatedUser: AuthenticatedUser;
}

// Login Failed
export const LOGIN_FAILURE = 'auth/login-failed'; // with credentials, and reason
export interface LoginFailedAction {
  type: 'auth/login-failed';
  payload: {
    userCredentials: UserCredentials;
    failureReason: string;
  };
}

// Start logout
export const START_LOGOUT = 'auth/start-logout';
export interface StartLogoutAction {
  type: 'auth/start-logout';
}

// Logged out
export const LOGGED_OUT = 'auth/logout-success';
export interface LoggedOutAction {
  type: 'auth/logout-success';
}

// All Actions
export type AuthenticationAction =
  | StartLoginAction
  | LoginSuccessAction
  | LoginFailedAction
  | StartLogoutAction
  | LoggedOutAction;

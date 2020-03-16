import { AuthenticationState } from '../user-authentication';
import {
  START_LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  START_LOGOUT,
  LOGGED_OUT,
  AuthenticationAction,
  StartLoginAction,
  StartLogoutAction,
  LoginSuccessAction,
  LoginFailedAction,
  LoggedOutAction,
} from './flux-actions';

type reducer = (state: AuthenticationState, action: AuthenticationAction) => AuthenticationState;

export function handleAuthAction(state: AuthenticationState, action: AuthenticationAction): AuthenticationState {
  switch (action.type) {
    case START_LOGIN:
      return startLogin(state, action);
    case LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case LOGIN_FAILURE:
      return loginFailure(state, action);
    case START_LOGOUT:
      return startLogout(state, action);
    case LOGGED_OUT:
      return loggedOut(state, action);
    default:
      return state;
  }
}

function startLogin(state: AuthenticationState, _: StartLoginAction): AuthenticationState {
  return {
    ...state,
    actionState: {
      ...state.actionState,
      isPendingLogin: true,
    },
  };
}

function loginSuccess(state: AuthenticationState, action: LoginSuccessAction): AuthenticationState {
  return {
    ...state,
    isAuthorized: true,
    serverCredentials: { token: action.payload.authenticatedUser.userToken },
    userCredentials: action.payload.userCredentials,
    authenticatedUser: action.payload.authenticatedUser,
    actionState: {
      isPendingLogout: false,
      isPendingLogin: false,
      loginFailed: false,
      loginMessage: null,
    },
  };
}

function loginFailure(state: AuthenticationState, action: LoginFailedAction): AuthenticationState {
  return {
    ...state,
    isAuthorized: false,
    serverCredentials: null,
    userCredentials: action.payload.userCredentials,
    authenticatedUser: null,
    actionState: {
      isPendingLogout: false,
      isPendingLogin: false,
      loginFailed: true,
      loginMessage: action.payload.failureReason,
    },
  };
}

function startLogout(state: AuthenticationState, _: StartLogoutAction): AuthenticationState {
  return {
    ...state,
    actionState: {
      ...state,
      isPendingLogout: true,
    },
  };
}

function loggedOut(state: AuthenticationState, action: LoggedOutAction): AuthenticationState {
  return {
    ...state,
    isAuthorized: false,
    serverCredentials: null,
    userCredentials: null,
    authenticatedUser: null,
    actionState: {
      isPendingLogout: false,
      isPendingLogin: false,
      loginFailed: false,
      loginMessage: null,
    },
  };
}

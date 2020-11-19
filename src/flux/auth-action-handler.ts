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

const baseState: AuthenticationState<any> = { isAuthorized: false, actionState: {} };

export function handleAuthAction<U>(
  state: AuthenticationState<U> = baseState,
  action: AuthenticationAction<U>,
): AuthenticationState<U> {
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

function startLogin<U>(state: AuthenticationState<U>, _: StartLoginAction): AuthenticationState<U> {
  return {
    ...state,
    actionState: {
      ...state.actionState,
      isPendingLogin: true,
    },
  };
}

function loginSuccess<U>(state: AuthenticationState<U>, action: LoginSuccessAction<U>): AuthenticationState<U> {
  return {
    ...state,
    isAuthorized: true,
    authenticatedUser: action.payload.authenticatedUser,
    actionState: {
      isPendingLogout: false,
      isPendingLogin: false,
      loginFailed: false,
      loginMessage: null,
    },
  };
}

function loginFailure<U>(state: AuthenticationState<U>, action: LoginFailedAction): AuthenticationState<U> {
  return {
    ...state,
    isAuthorized: false,
    authenticatedUser: null,
    actionState: {
      isPendingLogout: false,
      isPendingLogin: false,
      loginFailed: true,
      loginMessage: action.payload.failureReason,
    },
  };
}

function startLogout<U>(state: AuthenticationState<U>, _: StartLogoutAction): AuthenticationState<U> {
  return {
    ...state,
    actionState: {
      ...state,
      isPendingLogout: true,
    },
  };
}

function loggedOut<U>(state: AuthenticationState<U>, action: LoggedOutAction): AuthenticationState<U> {
  return {
    ...state,
    isAuthorized: false,
    authenticatedUser: null,
    actionState: {
      isPendingLogout: false,
      isPendingLogin: false,
      loginFailed: false,
      loginMessage: null,
    },
  };
}

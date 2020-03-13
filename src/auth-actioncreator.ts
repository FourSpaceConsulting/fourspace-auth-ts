import { UserCredentials, UserAuthentication } from './user-authentication';

export interface AuthenticationActionCreator {
  pendingLogin(): void;
  cancelPendingLogin(): void;
  performLogin(userCredentials: UserCredentials): Promise<UserAuthentication>;
  performLogout(): void;
  invalidateAuthorization(): void;
}

import { UserCredentials, UserAuthentication } from './user-authentication';

export interface AuthenticationActionCreator {
  performLogin(userCredentials: UserCredentials): Promise<UserAuthentication>;
  persistentLogin(): void;
  performLogout(): void;
  invalidateAuthorization(): void;
}

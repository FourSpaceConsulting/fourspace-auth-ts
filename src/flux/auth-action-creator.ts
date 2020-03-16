import { UserCredentials, LogoutInfo } from '../user-authentication';

export interface AuthenticationActionCreator {
  performLogin(userCredentials: UserCredentials): void;
  performLogout(logoutInfo: LogoutInfo): void;
  invalidateAuthorization(): void;
}

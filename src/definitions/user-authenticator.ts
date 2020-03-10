import { UserAuthentication, UserCredentials } from './user-authentication';

/**
 * Authenticates a user with a specific credential (e.g. password, external SSO token)
 */
export interface UserAuthenticator {
  authenticate(userCredentials: UserCredentials): Promise<UserAuthentication>;
}

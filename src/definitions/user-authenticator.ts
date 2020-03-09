import { UserAuthentication } from './user-authentication';

/**
 * Authenticates a user with a specific credential (e.g. password, external SSO token)
 */
export interface UserAuthenticator {
  authenticate(user: string, credentialType: string, credential: string): Promise<UserAuthentication>;
}

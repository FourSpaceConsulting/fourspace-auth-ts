import { AuthenticationState } from './user-authentication';

/**
 * Returns the authorization token from the user authentication object
 */
export interface TokenProvider {
  authorizationToken(authentication: AuthenticationState): string;
}

import { TokenProvider } from '../token-provider';
import { AuthenticationState } from '../user-authentication';

export class AuthTokenProvider implements TokenProvider {
  public authorizationToken(authentication: AuthenticationState): string {
    return authentication.serverCredentials?.token;
  }
}

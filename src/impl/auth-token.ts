import { TokenProvider } from '../token-provider';
import { UserAuthentication } from '../user-authentication';

export class AuthTokenProvider implements TokenProvider {
  public authorizationToken(authentication: UserAuthentication): string {
    return authentication.token;
  }
}

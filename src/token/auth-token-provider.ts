import { TokenProvider } from '../definitions/token-provider';
import { UserAuthentication } from '../definitions/user-authentication';

export class AuthTokenProvider implements TokenProvider {
  public authorizationToken(authentication: UserAuthentication): string {
    return authentication.token;
  }
}

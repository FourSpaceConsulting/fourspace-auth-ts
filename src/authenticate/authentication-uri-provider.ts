import { AuthenticationUri } from '../definitions/authentication-uri';

export class AuthenticationUriProvider implements AuthenticationUri {
  private readonly hostUri: string;
  private readonly uriPath: string;
  constructor(hostUri: string, uriPath: string) {
    this.hostUri = hostUri;
    this.uriPath = uriPath;
  }
  public get authenticateUri(): string {
    return this.hostUri + this.uriPath;
  }
}

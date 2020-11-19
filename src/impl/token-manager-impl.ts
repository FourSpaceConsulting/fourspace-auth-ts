import { AuthTokenService } from '../auth-service';
import { DateProvider } from '../date-provider';
import { AccessTokenResponse, TokenAndType, TokenExpiryDecoder, TokenManager, TokenType } from '../token';
import { TokenProvider } from '../token-provider';
import { StringTokenStorage } from '../util';

export class TokenManagerImpl implements TokenManager, TokenProvider {
  // storage for the tokens
  private _accessStorage: StringTokenStorage;
  private _refreshStorage: StringTokenStorage;
  private _rememberMeStorage: StringTokenStorage;
  // token helpers
  private _expiryDecoder: TokenExpiryDecoder;
  private _dateProvider: DateProvider;
  private _authTokenService: AuthTokenService;

  constructor(
    accessStorage: StringTokenStorage,
    refreshStorage: StringTokenStorage,
    rememberMeStorage: StringTokenStorage,
    expiryDecoder: TokenExpiryDecoder,
    dateProvider: DateProvider,
    authTokenService: AuthTokenService,
  ) {
    this._accessStorage = accessStorage;
    this._refreshStorage = refreshStorage;
    this._rememberMeStorage = rememberMeStorage;
    this._expiryDecoder = expiryDecoder;
    this._dateProvider = dateProvider;
    this._authTokenService = authTokenService;
  }

  public setTokenFromResponse(r: AccessTokenResponse): void {
    // set access and refresh if present
    if (r?.accessToken != null && r?.refreshToken != null) {
      this.setToken({ token: r.accessToken, type: TokenType.AccessToken });
      this.setToken({ token: r.refreshToken, type: TokenType.AccessToken });
    }
    // set remember me if present
    if (r?.rememberMeToken != null) {
      this.setToken({ token: r.rememberMeToken, type: TokenType.RememberMeToken });
    }
  }

  public setToken(t: TokenAndType) {
    switch (t?.type) {
      case TokenType.AccessToken:
        this._accessStorage.setToken(t.token);
        break;
      case TokenType.RefreshToken:
        this._refreshStorage.setToken(t.token);
        break;
      case TokenType.RememberMeToken:
        this._rememberMeStorage.setToken(t.token);
        break;
    }
  }

  public removeTokens(): void {
    this._accessStorage.deleteToken();
    this._refreshStorage.deleteToken();
    this._rememberMeStorage.deleteToken();
  }

  public getLatestAccessToken(): string | Promise<string> {
    const t = this.getUnexpiredToken();
    if (t?.type == null) return null;
    // if access token is unexpired, return it
    if (t.type === TokenType.AccessToken) {
      return t.token;
    }
    // otherwise update the token from either refresh or remember me
    return this.updateAccessToken(t);
  }

  public hasUnexpiredToken(): boolean {
    const t = this.getUnexpiredToken();
    return t?.token != null;
  }

  public getUnexpiredToken(): TokenAndType {
    const access = this.getUnexpiredAccessToken();
    if (access != null) {
      return { token: access, type: TokenType.AccessToken };
    }
    const refresh = this.getUnexpiredRefreshToken();
    if (refresh != null) {
      return { token: refresh, type: TokenType.RefreshToken };
    }
    const rememberMe = this.getUnexpiredRememberMeToken();
    if (rememberMe != null) {
      return { token: rememberMe, type: TokenType.RememberMeToken };
    }
    return { token: null, type: null };
  }

  public authorizationToken(): string | Promise<string> {
    return this.getLatestAccessToken();
  }

  // --- private methods ----

  private getUnexpiredAccessToken(): string {
    const token = this._accessStorage.getToken();
    return this.isTokenExpired(token) ? null : token;
  }

  private getUnexpiredRefreshToken(): string {
    const token = this._refreshStorage.getToken();
    return this.isTokenExpired(token) ? null : token;
  }

  private getUnexpiredRememberMeToken(): string {
    const token = this._rememberMeStorage.getToken();
    return this.isTokenExpired(token) ? null : token;
  }

  private isTokenExpired(token: string) {
    const tokenDate = this._expiryDecoder.decode(token);
    const now = this._dateProvider.getDateTime();
    return tokenDate == null || tokenDate < now;
  }

  private async updateAccessToken(t: TokenAndType): Promise<string> {
    const response: AccessTokenResponse = await this.doRefresh(t);
    if (response != null) {
      this._accessStorage.setToken(response.accessToken);
      this._refreshStorage.setToken(response.refreshToken);
      return response.accessToken;
    }
    return null;
  }

  private async doRefresh(t: TokenAndType): Promise<AccessTokenResponse> {
    switch (t?.type) {
      case TokenType.RefreshToken:
        return await this._authTokenService.refreshFromRefreshToken(t.token);
      case TokenType.RememberMeToken:
        return await this._authTokenService.refreshFromRememberMeToken(t.token);
    }
    return null;
  }
}

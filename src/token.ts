export enum TokenType {
  AccessToken,
  RefreshToken,
  RememberMeToken,
}

export interface TokenAndType {
  token: string;
  type: TokenType;
}

export interface AccessTokenResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly rememberMeToken?: string;
}

export interface TokenExpiryDecoder {
  decode(token: string): Date;
}

export interface TokenManager {
  hasUnexpiredToken(): boolean;
  getUnexpiredToken(): TokenAndType;
  getLatestAccessToken(): string | Promise<string>;
  removeTokens(): void;
  setToken(t: TokenAndType): void;
  setTokenFromResponse(r: AccessTokenResponse): void;
}

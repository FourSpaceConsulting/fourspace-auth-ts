export interface AuthenticatedUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  emailAddress: string;
  userToken: string;
  userTokenDate: string;
  secretKey: string;
}

export interface UserAuthentication {
  isAuthorized: boolean;
  authenticatedUser?: AuthenticatedUser;
  loginFailed?: boolean;
  user?: string;
  credentialType?: string;
  credential?: string;
  token?: string;
  timestamp?: any;
}

export interface AuthenticationPayload {
  invalidate?: boolean;
  userAuthentication?: UserAuthentication;
}

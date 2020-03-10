﻿export interface AuthenticatedUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  emailAddress: string;
  userToken: string;
  userTokenDate: string;
  secretKey: string;
}

export interface UserCredentials {
  userId: string;
  credentialType: string;
  credential: string;
}

export interface UserAuthentication {
  isAuthorized: boolean;
  authenticatedUser?: AuthenticatedUser;
  loginFailed?: boolean;
  loginMessage?: string;
  userCredentials?: UserCredentials;
  token?: string;
  timestamp?: any;
}

export interface AuthenticationPayload {
  invalidate?: boolean;
  userAuthentication?: UserAuthentication;
}

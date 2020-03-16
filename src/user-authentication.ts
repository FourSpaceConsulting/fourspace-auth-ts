export interface AuthenticatedUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullName: string;
  emailAddress: string;
  userToken: string;
  userTokenDate: string;
  secretKey: string;
}

export interface UserCredentials {
  userId: string;
  credentialType: string;
  credential: any;
}
export type UserCredentialsProvider = () => UserCredentials;

export interface ServerCredentials {
  token: string;
}
export interface LogoutInfo {
  credentialType: string;
}
export interface AuthenticationState {
  isAuthorized: boolean;
  authenticatedUser?: AuthenticatedUser;
  userCredentials?: UserCredentials;
  serverCredentials?: ServerCredentials;
  actionState: {
    isPendingLogin?: boolean;
    isPendingLogout?: boolean;
    loginFailed?: boolean;
    loginMessage?: string;
  };
}

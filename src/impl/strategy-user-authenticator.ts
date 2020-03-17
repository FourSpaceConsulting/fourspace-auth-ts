import { UserAuthenticator } from '../user-authenticator';
import { UserCredentials, AuthenticatedUser, LogoutInfo } from '../user-authentication';

export class StrategyUserAuthenticator implements UserAuthenticator {
  private readonly strategyMap: Map<string, UserAuthenticator>;

  constructor(strategyMap: Map<string, UserAuthenticator>) {
    this.strategyMap = strategyMap;
  }

  public async authenticate(userCredentials: UserCredentials): Promise<AuthenticatedUser> {
    const service = this.strategyMap.get(userCredentials.credentialType);
    if (service != null) {
      return await service.authenticate(userCredentials);
    } else {
      throw {
        userCredentials,
        loginMessage: 'No service',
      };
    }
  }

  public async logout(logoutInfo: LogoutInfo): Promise<void> {
    const service = this.strategyMap.get(logoutInfo.credentialType);
    if (service != null) {
      return await service.logout(logoutInfo);
    }
    return Promise.resolve();
  }
}

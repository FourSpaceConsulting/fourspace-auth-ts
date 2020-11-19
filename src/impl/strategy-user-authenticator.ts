import { UserAuthenticator } from '../user-authenticator';
import { UserCredentials, LogoutInfo } from '../user-authentication';

export class StrategyUserAuthenticator<U> implements UserAuthenticator<U> {
  private readonly strategyMap: Map<string, UserAuthenticator<U>>;

  constructor(strategyMap: Map<string, UserAuthenticator<U>>) {
    this.strategyMap = strategyMap;
  }

  public async authenticate(userCredentials: UserCredentials): Promise<U> {
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

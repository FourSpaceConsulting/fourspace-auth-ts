import { Dispatcher } from 'fourspace-flux-ts';
import { AuthenticationPayload } from '../definitions/user-authentication';
import { UserAuthenticator } from '../definitions/user-authenticator';
import { AuthenticationActionCreator, AuthenticationActionCreatorImpl } from './authentication-action-creator';
import { AuthorizationStore, AuthorizationStoreImpl } from './authorization-store';

export class AuthenticationManager {
  private _userAuthenticator: UserAuthenticator;
  private _dispatcher: Dispatcher<AuthenticationPayload>;
  private _actionCreator: AuthenticationActionCreator;
  private _store: AuthorizationStore;

  constructor(dispatcher: Dispatcher<AuthenticationPayload>, userAuthenticator: UserAuthenticator) {
    this._dispatcher = dispatcher;
    this._userAuthenticator = userAuthenticator;
    this._store = new AuthorizationStoreImpl(dispatcher);
    this._actionCreator = new AuthenticationActionCreatorImpl(dispatcher, userAuthenticator);
  }

  public get userAuthenticator(): UserAuthenticator {
    return this._userAuthenticator;
  }

  public get store(): AuthorizationStore {
    return this._store;
  }

  public get dispatcher(): Dispatcher<AuthenticationPayload> {
    return this._dispatcher;
  }

  public get actionCreator(): AuthenticationActionCreator {
    return this._actionCreator;
  }
}

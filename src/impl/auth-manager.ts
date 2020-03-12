import { Dispatcher } from 'fourspace-flux-ts';
import { AuthenticationPayload } from '../user-authentication';
import { UserAuthenticator } from '../user-authenticator';
import { AuthenticationActionCreator } from '../auth-actioncreator';
import { AuthenticationActionCreatorImpl } from './actioncreatorimpl';
import { AuthenticationStoreImpl } from './auth-storeimpl';
import { AuthenticationStore } from '../auth-store';

export class AuthenticationManager {
  private _userAuthenticator: UserAuthenticator;
  private _dispatcher: Dispatcher<AuthenticationPayload>;
  private _actionCreator: AuthenticationActionCreator;
  private _store: AuthenticationStore;

  constructor(dispatcher: Dispatcher<AuthenticationPayload>, userAuthenticator: UserAuthenticator) {
    this._dispatcher = dispatcher;
    this._userAuthenticator = userAuthenticator;
    this._store = new AuthenticationStoreImpl(dispatcher);
    this._actionCreator = new AuthenticationActionCreatorImpl(dispatcher, userAuthenticator);
  }

  public get userAuthenticator(): UserAuthenticator {
    return this._userAuthenticator;
  }

  public get store(): AuthenticationStore {
    return this._store;
  }

  public get dispatcher(): Dispatcher<AuthenticationPayload> {
    return this._dispatcher;
  }

  public get actionCreator(): AuthenticationActionCreator {
    return this._actionCreator;
  }
}

import { Store } from 'fourspace-flux-ts';
import { UserAuthentication } from './user-authentication';

export interface AuthenticationStore extends Store<UserAuthentication, UserAuthentication> {}

import { PayloadDispatcher } from 'fourspace-flux-ts';
import { UserAuthenticator } from './../src/user-authenticator';
import { UserAuthentication, AuthenticationPayload, UserCredentials } from '../src/user-authentication';
import { AuthenticationStoreImpl } from './../src/impl/auth-storeimpl';
import { AuthenticationActionCreatorImpl } from '../src/impl/actioncreatorimpl';

describe('Test Authentication Action Creator', () => {

    test('Test basic request header', (done) => {
        // arrange
        const authDispatcher = new PayloadDispatcher<AuthenticationPayload>();
        const authenticator = new class TestAuthenticator implements UserAuthenticator {
            authenticate(userCredentials: UserCredentials): Promise<UserAuthentication> {
                const userAuth: UserAuthentication = { isAuthorized: false, loginFailed: true, userCredentials };
                return new Promise<UserAuthentication>((resolve) => { setTimeout(() => { resolve(userAuth) }, 500) });
            }
        }();
        const actionCreator = new AuthenticationActionCreatorImpl(authDispatcher, authenticator);
        const store = new AuthenticationStoreImpl(authDispatcher);
        const updates: UserAuthentication[] = [];
        const storeData: UserAuthentication[] = [];
        const receivedEvents = new Promise((resolve) => {
            store.addChangeListener(p => {
                updates.push(p);
                storeData.push(store.getStoreData());
                if (p.loginFailed) {
                    resolve();
                }
            });
        });
        // act
        actionCreator.pendingLogin();
        actionCreator.performLogin({ userId: null, credentialType: null, credential: null });
        // assert
        receivedEvents.then(() => {
            expect(updates.length).toBe(2);
            expect(updates[0].isPendingLogin).toBeTruthy();
            expect(updates[1].isPendingLogin).not.toBeTruthy();
            expect(updates[0]).toEqual(storeData[0]);
            expect(updates[1]).toEqual(storeData[1]);
            done();
        });

    });

});


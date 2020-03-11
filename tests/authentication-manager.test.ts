import { AuthenticationManager } from './../src/flux/authentication-manager';
import { InMemoryUserAuthenticator } from '../src/authenticate/in-memory-user-authenticator';
import { PayloadDispatcher } from 'fourspace-flux-ts';
import { UserAuthentication, AuthenticationPayload } from '../src/definitions/user-authentication';

describe('Test Authentication Manager', () => {

    test('Test success', (done) => {
        // arrange
        const authDispatcher = new PayloadDispatcher<AuthenticationPayload>();
        const authenticator = new InMemoryUserAuthenticator({ 'testUser': 'testPassword' });
        const authenticationManager = new AuthenticationManager(authDispatcher, authenticator);

        const updates: UserAuthentication[] = [];
        const storeData: UserAuthentication[] = [];
        const receivedEvents = new Promise((resolve) => {
            authenticationManager.store.addChangeListener(p => {
                updates.push(p);
                storeData.push(authenticationManager.store.getStoreData());
                if (!p.isPendingLogin) {
                    resolve();
                }
            });
        });
        // act
        authenticationManager.actionCreator.performLogin({ userId: 'testUser', credentialType: null, credential: 'testPassword' });
        // assert
        receivedEvents.then(() => {
            expect(updates.length).toBe(2);
            expect(updates[0].isPendingLogin).toBeTruthy();
            expect(updates[1].isPendingLogin).not.toBeTruthy();
            expect(updates[1].loginFailed).not.toBeTruthy();
            expect(updates[0]).toEqual(storeData[0]);
            expect(updates[1]).toEqual(storeData[1]);
            done();
        });

    });


});


﻿import { AuthorizationStoreImpl } from './../src/flux/authorization-store';
import { AuthenticationActionCreatorImpl } from './../src/flux/authentication-action-creator';
import { UserAuthenticator } from './../src/definitions/user-authenticator';
import { PayloadDispatcher } from 'fourspace-flux-ts';
import { UserAuthentication, AuthenticationPayload, UserCredentials } from '../src/definitions/user-authentication';
import { AuthTokenProvider } from '../src/token/auth-token-provider';
import { RequestTokenAuthenticator } from '../src/request/request-token-authenticator';
import { RequestBasicAuthenticator } from '../src/request/request-basic-authenticator';
import * as Request from 'superagent';

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
        const store = new AuthorizationStoreImpl(authDispatcher);
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


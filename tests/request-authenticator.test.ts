import { AuthTokenProvider } from './../src/impl/auth-token';
import { UserAuthentication } from './../src/user-authentication';
import { TokenRequestAuthenticator } from './../src/impl/token-request';
import { BasicRequestAuthenticator } from '../src/impl/basic-request';

import * as Request from 'superagent';

describe('Test Request Authenticator', () => {

    test('Test basic request header', () => {
        // arrange
        const auth: UserAuthentication = { isAuthorized: true, userCredentials: { userId: 'testName', credentialType: 'native', credential: 'testPassword' } };
        const authorizer: BasicRequestAuthenticator = new BasicRequestAuthenticator(auth);
        const expected = 'Basic dGVzdE5hbWU6dGVzdFBhc3N3b3Jk';
        // act
        const req = Request.get('');
        const result = authorizer.authorizeRequest(req);
        // assert
        expect((req as any).header.Authorization).toBe(expected);
        expect((result as any).header.Authorization).toBe(expected);
    });

    test('Test token request header', () => {
        // arrange
        const auth: UserAuthentication = { isAuthorized: true, token: 'testToken' };
        const provider: AuthTokenProvider = new AuthTokenProvider();
        const authorizer: TokenRequestAuthenticator = new TokenRequestAuthenticator(auth, provider);
        const expected = 'Bearer testToken';
        // act
        const req = Request.get('');
        const result = authorizer.authorizeRequest(req);
        // assert
        expect((req as any).header.Authorization).toBe(expected);
        expect((result as any).header.Authorization).toBe(expected);
    });


});


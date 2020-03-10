import { UserAuthentication } from './../src/definitions/user-authentication';
import { AuthTokenProvider } from './../src/token/auth-token-provider';
import { RequestTokenAuthenticator } from './../src/request/request-token-authenticator';
import { RequestBasicAuthenticator } from '../src/request/request-basic-authenticator';
import * as Request from 'superagent';

describe('Test Request Authenticator', () => {

    test('Test basic request header', () => {
        // arrange
        const auth: UserAuthentication = { isAuthorized: true, userCredentials: { userId: 'testName', credentialType: 'native', credential: 'testPassword' } };
        const authorizer: RequestBasicAuthenticator = new RequestBasicAuthenticator(auth);
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
        const authorizer: RequestTokenAuthenticator = new RequestTokenAuthenticator(auth, provider);
        const expected = 'Bearer testToken';
        // act
        const req = Request.get('');
        const result = authorizer.authorizeRequest(req);
        // assert
        expect((req as any).header.Authorization).toBe(expected);
        expect((result as any).header.Authorization).toBe(expected);
    });


});


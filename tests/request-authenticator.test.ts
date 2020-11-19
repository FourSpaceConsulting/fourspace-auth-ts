import { TokenRequestAuthenticator } from './../src/impl/token-request-authenticator';
import { BasicRequestAuthenticator } from '../src/impl/basic-request';

import * as Request from 'superagent';
import { TokenProvider } from '../src/token-provider';

describe('Test Request Authenticator', () => {

    test('Test basic request header', () => {
        // arrange
        const authorizer: BasicRequestAuthenticator<Request.Request> = new BasicRequestAuthenticator<Request.Request>('testName', 'testPassword');
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
        const provider: TokenProvider = { authorizationToken: () => 'testToken' };
        const authorizer = new TokenRequestAuthenticator(provider);
        const expected = 'testToken';
        // act
        const req = Request.get('');
        const result = authorizer.authorizeRequest(req);
        // assert
        expect((req as any).header.Authorization).toBe(expected);
        expect((result as any).header.Authorization).toBe(expected);
    });


});


import { TokenRequestAuthenticator } from './../src/impl/token-request-authenticator';
import { BasicRequestAuthenticator } from '../src/impl/basic-request';
import { TokenProvider } from '../src/token-provider';

interface TestRequestLike {
    set(field: string, val: string): this;
    auth(user: string, pwd: string, options: { type: string }): this;
}

describe('Test Request Authenticator', () => {

    const RequestMocker = jest.fn<TestRequestLike, []>(() => ({
        set: jest.fn().mockReturnThis(),
        auth: jest.fn().mockReturnThis()
    }));

    test('Test basic request header', async () => {
        // arrange
        const authorizer: BasicRequestAuthenticator<TestRequestLike> = new BasicRequestAuthenticator<TestRequestLike>('testName', 'testPassword');
        // act
        const req = new RequestMocker();
        await authorizer.authorizeRequest(req);
        // assert
        expect(req.auth).toHaveBeenCalledTimes(1);
        expect(req.auth).toHaveBeenCalledWith('testName', 'testPassword', { type: 'basic' });
    });

    test('Test token request header', async () => {
        // arrange
        const provider: TokenProvider = { authorizationToken: () => 'testToken' };
        const authorizer = new TokenRequestAuthenticator(provider);
        const expected = 'testToken';
        // act
        const req = new RequestMocker();
        await authorizer.authorizeRequest(req);
        // assert
        expect(req.set).toHaveBeenCalledTimes(1);
        expect(req.set).toHaveBeenCalledWith('Authorization', expected);
    });


});


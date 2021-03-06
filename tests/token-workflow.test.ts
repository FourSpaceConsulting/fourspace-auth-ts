import { TokenManagerImpl } from '../src/impl/token-manager-impl';
import { TokenExpiryDecoderStringSeparated } from '../src/impl/token-expiry-decoder';
import { ApiNativeAuthenticator } from '../src/impl/api-native-authenticator';
import { MemoryStorage, StringTokenStorage } from '../src/util';
import { DateProvider, DateProviderSystem } from '../src/date-provider';
import { AuthTokenService, AuthUserService } from '../src/auth-service';
import { AccessTokenResponse } from '../src/token';
import moment from 'moment';
import { LogInCredentials } from '../src/user-authentication';
import { AuthenticationActionCreatorImpl } from '../src/flux/action-creator-impl';
import { Dispatcher } from 'fourspace-flux-ts';
import { AuthenticationAction, LoginFailedAction, LoginSuccessAction, LOGIN_FAILURE, LOGIN_SUCCESS, StartLoginAction, START_LOGIN } from '../src/flux/flux-actions';
import { AuthenticationActionCreator } from '../src/flux/auth-action-creator';
import { UserAuthenticator } from '../src/user-authenticator';

describe('Test Request Authenticator', () => {

    // test types
    enum CredentialType {
        UserPassword = 'UserPassword',
        Token = 'Token'
    }
    interface TestUser {
        username: string;
    }
    // test user info
    const testUserInstance: TestUser = { username: 'testUser' };
    const testUserPassword = 'testPassword';
    const testUserAccessToken = 'IOhOX_7thgqJSbL8IzACweUcIP2D--.RWyzKLK2aQqTVnSOD_NdsY-bbY6b656oqkImx2H62Bq1M7r_ea.QdeNYRgAAAA=';

    // Mock classes
    const TokenServiceMocker = jest.fn<AuthUserService<TestUser>, [any, any]>((loginFail, userDetailsFail) => ({
        loginWithUserId: jest.fn((username: string, password: string, remember: boolean): Promise<AccessTokenResponse> => {
            if (username === testUserInstance.username && password === testUserPassword) {
                return Promise.resolve({ accessToken: testUserAccessToken, refreshToken: testUserAccessToken });
            }
            return Promise.reject(loginFail);
        }),
        getUserDetails: jest.fn((accessToken: string): Promise<TestUser> => {
            if (accessToken === testUserAccessToken) {
                return Promise.resolve(testUserInstance);
            }
            return Promise.reject(userDetailsFail);
        }),
        logout: jest.fn((token: string): Promise<boolean> => { return null; }),
        refreshFromRefreshToken: jest.fn((refreshToken: string): Promise<AccessTokenResponse> => { return null; }),
        refreshFromRememberMeToken: jest.fn((rememberMeToken: string): Promise<AccessTokenResponse> => { return null; }),
    }));
    const DateProviderMocker = jest.fn<DateProvider, [Date]>((date) => ({
        getDateTime: jest.fn(() => date),
        saveToken: jest.fn(),
    }));
    const DispatcherMocker = jest.fn<Dispatcher<AuthenticationAction<TestUser>>, []>(() => ({
        dispatch: jest.fn((payload: any): void => { return null })
    }));

    // Build the action creator, returning mock objects for assertions
    function buildCreator(testDate: Date): [
        Dispatcher<AuthenticationAction<TestUser>>,
        AuthUserService<TestUser>,
        AuthenticationActionCreator
    ] {
        const userService = new TokenServiceMocker(new Error('Login Error'), new Error('User Details Error'));
        const tokenManager = new TokenManagerImpl(
            new MemoryStorage(),
            new MemoryStorage(),
            new MemoryStorage(),
            new TokenExpiryDecoderStringSeparated('.'),
            new DateProviderMocker(testDate),
            userService
        );
        const dispatcher = new DispatcherMocker();
        const authenticator = new ApiNativeAuthenticator(userService, tokenManager, CredentialType.UserPassword);
        const actionCreator = new AuthenticationActionCreatorImpl(dispatcher, authenticator);
        return [
            dispatcher,
            userService,
            actionCreator
        ]
    }

    test('Test Login Succeed', async () => {
        // arrange
        const testDate = moment(Date.UTC(2020, 1, 1, 14, 20)).toDate();
        const [dispatcher, userService, actionCreator] = buildCreator(testDate);
        // act
        const loginCredentials: LogInCredentials = { userId: 'testUser', password: 'testPassword', remember: true };
        const userCredentials = { credentialType: CredentialType.UserPassword, credential: loginCredentials };
        await actionCreator.performLogin(userCredentials);
        // assert
        expect(userService.loginWithUserId).toHaveBeenCalledTimes(1);
        expect(userService.loginWithUserId).toHaveBeenCalledWith(loginCredentials.userId, loginCredentials.password, loginCredentials.remember);
        expect(userService.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userService.getUserDetails).toHaveBeenCalledWith(testUserAccessToken);
        expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
        expect(dispatcher.dispatch).toHaveBeenCalledWith<StartLoginAction[]>(
            {
                type: START_LOGIN
            });
        expect(dispatcher.dispatch).toHaveBeenCalledWith<LoginSuccessAction<TestUser>[]>(
            {
                type: LOGIN_SUCCESS,
                payload: {
                    userCredentials,
                    authenticatedUser: testUserInstance,
                },
            });
    });

    test('Test Login Failed', async () => {
        // arrange
        const testDate = moment(Date.UTC(2020, 1, 1, 14, 20)).toDate();
        const [dispatcher, userService, actionCreator] = buildCreator(testDate);
        // act
        const loginCredentials: LogInCredentials = { userId: 'testUser', password: 'wrong', remember: true };
        const userCredentials = { credentialType: CredentialType.UserPassword, credential: loginCredentials };
        await actionCreator.performLogin(userCredentials);
        // assert
        expect(userService.loginWithUserId).toHaveBeenCalledTimes(1);
        expect(userService.loginWithUserId).toHaveBeenCalledWith(loginCredentials.userId, loginCredentials.password, loginCredentials.remember);
        expect(userService.getUserDetails).toHaveBeenCalledTimes(0);
        expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
        expect(dispatcher.dispatch).toHaveBeenCalledWith<StartLoginAction[]>(
            {
                type: START_LOGIN
            });
        expect(dispatcher.dispatch).toHaveBeenCalledWith<LoginFailedAction[]>(
            {
                type: LOGIN_FAILURE,
                payload: {
                    userCredentials,
                    failureReason: 'Login Error',
                },
            });
    });

    test('Test Token Succeed', async () => {
        // arrange
        const testDate = moment(Date.UTC(2020, 1, 1, 14, 20)).toDate();
        const [dispatcher, userService, actionCreator] = buildCreator(testDate);
        // act
        const userCredentials = { credentialType: CredentialType.Token, credential: testUserAccessToken };
        await actionCreator.performLogin(userCredentials);
        // assert
        expect(userService.loginWithUserId).toHaveBeenCalledTimes(0);
        expect(userService.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userService.getUserDetails).toHaveBeenCalledWith(userCredentials.credential);
        expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
        expect(dispatcher.dispatch).toHaveBeenCalledWith<StartLoginAction[]>(
            {
                type: START_LOGIN
            });
        expect(dispatcher.dispatch).toHaveBeenCalledWith<LoginSuccessAction<TestUser>[]>(
            {
                type: LOGIN_SUCCESS,
                payload: {
                    userCredentials,
                    authenticatedUser: testUserInstance,
                },
            });
    });

    test('Test Token Failed', async () => {
        // arrange
        const testDate = moment(Date.UTC(2020, 1, 1, 14, 20)).toDate();
        const [dispatcher, userService, actionCreator] = buildCreator(testDate);
        // act
        const userCredentials = { credentialType: CredentialType.Token, credential: 'FAKE_TOKEN' };
        await actionCreator.performLogin(userCredentials);
        // assert
        expect(userService.loginWithUserId).toHaveBeenCalledTimes(0);
        expect(userService.getUserDetails).toHaveBeenCalledTimes(1);
        expect(userService.getUserDetails).toHaveBeenCalledWith(userCredentials.credential);
        expect(dispatcher.dispatch).toHaveBeenCalledTimes(2);
        expect(dispatcher.dispatch).toHaveBeenCalledWith<StartLoginAction[]>(
            {
                type: START_LOGIN
            });
        expect(dispatcher.dispatch).toHaveBeenCalledWith<LoginFailedAction[]>(
            {
                type: LOGIN_FAILURE,
                payload: {
                    userCredentials,
                    failureReason: 'User Details Error',
                },
            });
    });



});
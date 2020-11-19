import moment from 'moment';
import { LogFactory } from 'fourspace-logger-ts';
import { TokenExpiryDecoder } from "../token";

const LOGGER = LogFactory.getLogger('api-user-authenticator');

export class TokenExpiryDecoderStringSeparated implements TokenExpiryDecoder {
    private readonly _separator: string;

    constructor(separator: string) {
        this._separator = separator;
    }

    public decode(token: string): Date {
        const expiry = token?.split(this._separator)[2];
        try {
            const expire = expiry == null ? 0 : Buffer.from(expiry, 'base64').readDoubleBE(0);
            return expiry == null ? null : moment.unix(expire).toDate();
        } catch (e) {
            LOGGER.warn('Error decoding token', e);
            return null;
        }
    }
}
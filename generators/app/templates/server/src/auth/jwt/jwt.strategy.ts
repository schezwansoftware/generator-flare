import {Injectable, Inject, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import * as passport from 'passport';
import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt';
import {SecurityUtils} from '../security/security.utils';
import {TokenProvider} from './token.provider';
import {JWT_SECRET} from '../../app.constants';
import * as contextService from 'request-context';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly tokenProvider: TokenProvider) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: JWT_SECRET,
            },
            async (req, payload, done) => this.validate(req, payload, done),
        );
    }
    async validate(req: any, payload: any, callback: VerifiedCallback) {
        const user = await this.tokenProvider.validateToken(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        contextService.set('request:user', user);
        return callback(null, user);
    }
}

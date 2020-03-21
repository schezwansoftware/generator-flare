import { Module } from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {TokenProvider} from './jwt/token.provider';
import {JwtStrategy} from './jwt/jwt.strategy';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JWT_SECRET} from '../app.constants';

@Module({
    imports: [UserModule,
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRY_TIME_IN_SECONDS || 86400 },
        })],
    providers: [TokenProvider, JwtStrategy],
    exports: [TokenProvider],
})
export class AuthModule {}

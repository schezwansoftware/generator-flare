import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import * as passport from 'passport';
import {SecurityUtils} from '../security/security.utils';

@Injectable()
export class AuthGuard implements CanActivate {
    public constructor(private readonly reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
        if (isPublic) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const next = context.switchToHttp().getNext();
        return new Promise<boolean>(resolve => {
            passport.authenticate('jwt', {session: false}, (auth, user) => {
                if (user) {
                    return resolve(user);
                }
                throw new UnauthorizedException();
            })(req, res, next);
        });
    }
}

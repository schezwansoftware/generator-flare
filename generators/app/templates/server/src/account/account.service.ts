import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {UserDTO} from '../user/user.dto';
import {LoginVM} from './login.model';
import {JWTToken} from '../auth/jwt/token.model';
import {TokenProvider} from '../auth/jwt/token.provider';
import {IUser} from '../user/user.interface';
import * as bcrypt from 'bcrypt';
import {is} from '@babel/types';
import {SecurityUtils} from '../auth/security/security.utils';

@Injectable()
export class AccountService {

    constructor(private userService: UserService, private tokenProvider: TokenProvider) {
    }

    async register(accontDTO: UserDTO): Promise<UserDTO> {
        return await this.userService.createNew(accontDTO);
    }

    async authenticate(loginVM: LoginVM): Promise<JWTToken> {
        const user: IUser = await this.userService.findOneWithAuthoritiesByEmailOrLogin(loginVM.username);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const isvalidPassword = await bcrypt.compare(loginVM.password, user.password);
        if (!isvalidPassword) {
            throw new UnauthorizedException('Invalid username/password.');
        }
        return this.tokenProvider.createToken(user);
    }

    async getAccount(): Promise<UserDTO> {
        return await this.userService.findOneWithAuthoritiesByEmail(SecurityUtils.getCurrentUserLoggedIn().email);
    }

    async changePasswordRequest(accontDTO: UserDTO): Promise<UserDTO> {
        return null;
    }

    async changePasswordFinish(accontDTO: UserDTO): Promise<UserDTO> {
        return null;
    }
}

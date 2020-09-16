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
import {USER} from '../auth/security/authority.constants';
import {MailerService} from '@nestjs-modules/mailer';
import {MAIL_FROM} from '../app.constants';
import {MailService} from '../shared/services/mail.service';

@Injectable()
export class AccountService {

    constructor(private userService: UserService, private tokenProvider: TokenProvider, private mailService: MailService) {
    }

    async register(userDTO: UserDTO, password: string): Promise<void> {
        if (!userDTO.authorities || userDTO.authorities.length === 0) {
            userDTO.authorities = [USER];
        }
        const user = await this.userService.registerUser(userDTO, password);
        this.mailService.sendCreationEmail(user);
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

    async activateAccount(activationKey: string): Promise<void> {
      return this.userService.activateAccount(activationKey);
    }

    async getAccount(): Promise<UserDTO> {
        return await this.userService.findOneWithAuthoritiesByEmail(SecurityUtils.getCurrentUserLoggedIn().email);
    }

    async updateAccount(userDTO: UserDTO): Promise<UserDTO> {
      return await this.userService.updateUser(userDTO);
    }

    async changePasswordRequest(email: string): Promise<void> {
      const user = await this.userService.resetPasswordInit(email);
      this.mailService.sendPasswordResetEmail(user);
    }

    async changePasswordFinish(resetKey: string, newPassword: string): Promise<void> {
      return this.userService.passwordResetFinish(resetKey, newPassword);
    }
}

import {Injectable} from '@nestjs/common';
import {IUser} from '../../user/user.interface';
import {UserService} from '../../user/user.service';
import {JwtService} from '@nestjs/jwt';
import {JWTToken} from './token.model';
import {JWT_EXPIRY_TIME_IN_SECONDS} from '../../app.constants';
import {UserRepository} from '../../user/user.repository';

@Injectable()
export class TokenProvider {

    constructor(private userRepository: UserRepository, private readonly jwtService: JwtService) {
    }

    createToken(user: IUser): JWTToken {
        const expiresIn = Number(JWT_EXPIRY_TIME_IN_SECONDS);
        const authorities = user.authorities || [];
        const email = user.email;
        const authurities = authorities.join(',');
        const payload = {email, authorities};
        const token = this.jwtService.sign(payload);
        return new JWTToken(expiresIn, token);
    }

    async validateToken(payload: any): Promise<IUser> {
        return await this.userRepository.findByEmail(payload.email);
    }
}

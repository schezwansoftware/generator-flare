import {Injectable} from '@nestjs/common';
import {IUser, User} from './user.interface';
import {UserDTO} from './user.dto';

@Injectable()
export class UserMapper {

    mapUserToUserDTO(user: IUser): UserDTO {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: null,
            login: user.login,
            authorities: user.authorities,
            resetKey: user.resetKey,
            resetDate: user.resetDate,
        };
    }

    mapUserDTOToUser(user: UserDTO): IUser {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            login: user.login,
            authorities: user.authorities,
            resetKey: user.resetKey,
            resetDate: user.resetDate,
        };
    }

    mapUserToUserDTOList(users: IUser[]): UserDTO[] {
        const userDTOs: UserDTO[] = [];
        for (const user of users) {
            userDTOs.push(this.mapUserToUserDTO(user));
        }
        return userDTOs;
    }
}

import {Injectable} from '@nestjs/common';
import {User} from './user.interface';
import {UserDTO} from './user.dto';

@Injectable()
export class UserMapper {

    mapUserToUserDTO(user: User): UserDTO {
        return {
            id: user._id,
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

    mapUserToUserDTOList(users: User[]): UserDTO[] {
        const userDTOs: UserDTO[] = [];
        for (const user of users) {
            userDTOs.push(this.mapUserToUserDTO(user));
        }
        return userDTOs;
    }
}

import { Injectable } from '@nestjs/common';
import {UserRepository} from './user.repository';
import {UserDTO} from './user.dto';
import {UserMapper} from './user.mapper';

@Injectable()
export class UserService {

    constructor(private userRepository: UserRepository, private userMapper: UserMapper) {}

   async createNew(userDTO: UserDTO): Promise<UserDTO> {
        const user = await this.userRepository.save(userDTO);
        return this.userMapper.mapUserToUserDTO(user);
    }

}

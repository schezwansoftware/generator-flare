import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {UserDTO} from './user.dto';
import {UserMapper} from './user.mapper';
import {User} from './user.interface';

@Injectable()
export class UserService {

    constructor(private userRepository: UserRepository, private userMapper: UserMapper) {}

   async createNew(userDTO: UserDTO): Promise<UserDTO> {
        if (await this.userRepository.findByEmail(userDTO.email)) {
            throw new BadRequestException('A User is already registered with this email');
        }
        if (await this.userRepository.findByLogin(userDTO.login)) {
            throw new BadRequestException('A User is already registered with this login');
        }
        const user = await this.userRepository.save(userDTO);
        return this.userMapper.mapUserToUserDTO(user);
    }

    async updateUser(userDTO: UserDTO): Promise<UserDTO> {
        let existingUser = await this.userRepository.findByEmail(userDTO.email);
        if (existingUser && existingUser.id != userDTO.id) {
            throw new BadRequestException('A User is already registered with this email');
        }
        existingUser = await this.userRepository.findByLogin(userDTO.login);
        if (existingUser && existingUser.id != userDTO.id) {
            throw new BadRequestException('A User is already registered with this user');
        }
        const user: User = await this.userRepository.update(userDTO);
        if (user) {
            return this.userMapper.mapUserToUserDTO(user);
        }
        throw new BadRequestException('Invalid id.');
    }

    async findAllManagedUsers(): Promise<UserDTO[]> {
        const users: User[] = await this.userRepository.findAll();
        return this.userMapper.mapUserToUserDTOList(users);
    }

    async findOneWithAuthoritiesById(id: string): Promise<UserDTO> {
        const user: User = await this.userRepository.findById(id);
        if (user) {
            return this.userMapper.mapUserToUserDTO(user);
        }
        throw new BadRequestException('Invalid Id.');
    }

    async deleteUser(id: string): Promise<void> {
      return await this.userRepository.deleteById(id);
    }

}

import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {UserDTO} from './user.dto';
import {UserMapper} from './user.mapper';
import {IUser} from './user.interface';

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
        const user = await this.userRepository.save(this.userMapper.mapUserDTOToUser(userDTO));
        return this.userMapper.mapUserToUserDTO(user);
    }

    async updateUser(userDTO: UserDTO): Promise<UserDTO> {
        let existingUser = await this.userRepository.findByEmail(userDTO.email);
        if (existingUser && existingUser.id !== userDTO.id) {
            throw new BadRequestException('A User is already registered with this email');
        }
        existingUser = await this.userRepository.findByLogin(userDTO.login);
        if (existingUser && existingUser.id !== userDTO.id) {
            throw new BadRequestException('A User is already registered with this user');
        }
        const user: IUser = await this.userRepository.update(this.userMapper.mapUserDTOToUser(userDTO));
        if (user) {
            return this.userMapper.mapUserToUserDTO(user);
        }
        throw new BadRequestException('Invalid id.');
    }

    async findAllManagedUsers(): Promise<UserDTO[]> {
        const users: IUser[] = await this.userRepository.findAll();
        return this.userMapper.mapUserToUserDTOList(users);
    }

    async findOneWithAuthoritiesById(id: string): Promise<UserDTO> {
        const user: IUser = await this.userRepository.findById(id);
        if (user) {
            return this.userMapper.mapUserToUserDTO(user);
        }
        throw new BadRequestException('Invalid Id.');
    }

    async findOneWithAuthoritiesByEmail(email: string): Promise<UserDTO> {
        const user: IUser = await this.userRepository.findByEmail(email);
        if (user) {
            return this.userMapper.mapUserToUserDTO(user);
        }
        throw new BadRequestException('Invalid Email.');
    }

    async findOneWithAuthoritiesByEmailOrLogin(email: string): Promise<IUser> {
        return await this.userRepository.findByEmailOrLogin(email);
    }

    async findOneWithAuthoritiesByLogin(login: string): Promise<UserDTO> {
        const user: IUser = await this.userRepository.findByLogin(login);
        if (user) {
            return this.userMapper.mapUserToUserDTO(user);
        }
        throw new BadRequestException('Invalid Login.');
    }

    async deleteUser(id: string): Promise<void> {
      return await this.userRepository.deleteById(id);
    }

}

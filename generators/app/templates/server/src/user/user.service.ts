import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserDTO} from './user.dto';
import {UserMapper} from './user.mapper';
import {IUser} from './user.interface';
import * as bcrypt from 'bcrypt';
import * as randomString from 'randomstring';
import {USER} from '../auth/security/authority.constants';
<% if (dbType === 'mongodb') {%>import {UserRepository} from './user.repository';
  <%}%><% if (dbType === 'mysql') {%>import {UsersRepository as UserRepository} from './user.repository';
  <%}%>
@Injectable()
export class UserService {

    constructor(private userRepository: UserRepository, private userMapper: UserMapper) {
    }

    async createNew(userDTO: UserDTO): Promise<UserDTO> {
        if (await this.userRepository.findByEmail(userDTO.email)) {
            throw new BadRequestException('A User is already registered with this email');
        }
        if (await this.userRepository.findByLogin(userDTO.login)) {
            throw new BadRequestException('A User is already registered with this login');
        }
        if (!userDTO.authorities || userDTO.authorities.length === 0) {
            userDTO.authorities = [USER];
        }
        let user: IUser = this.userMapper.mapUserDTOToUser(userDTO);
        user.password = randomString.generate({
            length: 20,
            charset: 'alphanumeric',
        });
        user.resetKey = randomString.generate({
           length: 15,
           charset: 'alphanumeric',
        });
        user.resetDate = new Date();
        user = await this.userRepository.save(user);
        return this.userMapper.mapUserToUserDTO(user);
    }

    async registerUser(userDTO: UserDTO, password: string): Promise<IUser> {
        if (await this.userRepository.findByEmail(userDTO.email)) {
            throw new BadRequestException('A User is already registered with this email');
        }
        if (await this.userRepository.findByLogin(userDTO.login)) {
            throw new BadRequestException('A User is already registered with this login');
        }
        let user: IUser = this.userMapper.mapUserDTOToUser(userDTO);
        user.password = password;
        user.activationKey = randomString.generate({
          length: 15,
          charset: 'numeric',
        });
        user.activated = false;
        user = await this.userRepository.save(user);
        return user;
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
        existingUser = await this.userRepository.findById(userDTO.id);
        if (existingUser) {
            let newUser: IUser = this.userMapper.mapUserDTOToUser(userDTO);
            newUser.password = existingUser.password;
            newUser.resetDate = existingUser.resetDate;
            newUser.resetKey = existingUser.resetKey;
            newUser = await this.userRepository.save(newUser);
            return this.userMapper.mapUserToUserDTO(newUser);
        }
        throw new BadRequestException('Invalid id.');
    }

    async activateAccount(activationKey: string): Promise<void> {
        const user = await this.userRepository.findByActivationKey(activationKey);
        if (!user) {
          throw new BadRequestException('Either the key is invalid or expired.');
        }
        user.activated = true;
        user.activationKey = null;
        await this.userRepository.update(user);
    }

    async resetPasswordInit(email: string): Promise<IUser> {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new BadRequestException('This email doesn\'t exist.');
      }
      user.resetKey = randomString.generate({
        length: 15,
        charset: 'numeric',
      });
      var resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 1);
      user.resetDate = resetDate;
      return await this.userRepository.update(user);
    }

    async passwordResetFinish(resetKey: string, newPassword: string): Promise<void> {
      const user = await this.userRepository.findByResetKey(resetKey);
      if (!user) {
        throw new BadRequestException('Invalid Reset password link');
      }
      const currentDate = new Date();
      const userResetDate = new Date(user.resetDate);
      if (user.resetKey && userResetDate > currentDate) {
        user.resetDate = null;
        user.resetKey = null;
        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(user);
      } else {
        throw new BadRequestException('The reset password link has expired. Your password couldn\'t be reset. Remember a password request is only valid for 24 hours.');
      }
    }

    async findAllManagedUsers(): Promise<UserDTO[]> {
        const users: IUser[] = await this.userRepository.findAll();
        return this.userMapper.mapUserToUserDTOList(users);
    }

    async findOneWithAuthoritiesById(<% if (dbType === 'mongodb') {%>id: string<%}%><% if (dbType === 'mysql') {%>id: number<%}%>): Promise<UserDTO> {
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

    async deleteUser(<% if (dbType === 'mongodb') {%>id: string<%}%><% if (dbType === 'mysql') {%>id: number<%}%>): Promise<void> {
        return await this.userRepository.deleteById(id);
    }

    <% if (dbType === 'mysql') {%>

    <%}%>
}

<% if (dbType === 'mongodb') {%>
  import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
  import {UserDTO} from './user.dto';
  import {UserMapper} from './user.mapper';
  import {IUser} from './user.interface';
  import * as bcrypt from 'bcrypt';
  import * as randomString from 'randomstring';
  import {USER} from '../auth/security/authority.constants';
  import {SecurityUtils} from '../auth/security/security.utils';
  import {UserRepository} from './user.repository';

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
      if (SecurityUtils.getCurrentUserLoggedIn() && SecurityUtils.getCurrentUserLoggedIn().id) {
        const existingUser: IUser = await this.userRepository.findByEmail(userDTO.email);
        if (existingUser && existingUser.id !== SecurityUtils.getCurrentUserLoggedIn().id) {
          throw new BadRequestException('Email Already exists.');
        }
        let currentUser = await this.userRepository.findById(SecurityUtils.getCurrentUserLoggedIn().id);
        if (currentUser) {
          currentUser.email = userDTO.email;
          currentUser.firstName = userDTO.firstName;
          currentUser.lastName = userDTO.lastName;
          currentUser = await this.userRepository.update(currentUser);
          return this.userMapper.mapUserToUserDTO(currentUser);
        }
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

    async changePassword(newPassword: string, oldPassword: string): Promise<void> {
      if (oldPassword === newPassword) {
        throw new BadRequestException('Old Password and New password cannot be same');
      }
      const user = await this.findOneWithAuthorities();
      if (user && await this.validatePassword(oldPassword, user)) {
        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(user);
        return;
      }
      throw new BadRequestException('Invalid old password.');
    }

    async findAllManagedUsers(): Promise<UserDTO[]> {
      const users: IUser[] = await this.userRepository.findAll();
      return this.userMapper.mapUserToUserDTOList(users);
    }



    async findOneWithAuthoritiesByEmail(email: string): Promise<UserDTO> {
      const user: IUser = await this.userRepository.findByEmail(email);
      if (user) {
        return this.userMapper.mapUserToUserDTO(user);
      }
      throw new BadRequestException('Invalid Email.');
    }

    async findOneWithAuthorities(): Promise<IUser> {
      if (SecurityUtils.getCurrentUserLoggedIn()) {
        return await this.userRepository.findById(SecurityUtils.getCurrentUserLoggedIn().id);
      }
      return null;
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

    async findOneWithAuthoritiesById(id: string): Promise<UserDTO> {
      const user: IUser = await this.userRepository.findById(id);
      if (user) {
        return this.userMapper.mapUserToUserDTO(user);
      }
      throw new BadRequestException('Invalid Id.');
    }

    async deleteUser(<% if (dbType === 'mongodb') {%>id: string<%}%><% if (dbType === 'mysql') {%>id: number<%}%>): Promise<void> {
        return await this.userRepository.deleteById(id);
    }

    private async validatePassword(password: string, user: IUser): Promise<boolean> {
        return await bcrypt.compare(password, user.password);
    }
<%} %><% if (dbType === 'mysql') {%>import {BadRequestException, Injectable} from '@nestjs/common';
import {UserDTO} from './user.dto';
import {UserMapper} from './user.mapper';
import {IUser} from './user.interface';
import * as bcrypt from 'bcrypt';
import * as randomString from 'randomstring';
import {USER} from '../auth/security/authority.constants';
import {SecurityUtils} from '../auth/security/security.utils';
import {UserRepository} from './user.repository';
import {FindOneOptions} from 'typeorm';
import {User} from './user.model';
import {InjectRepository} from '@nestjs/typeorm';


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository, private userMapper: UserMapper) {
    }

    async createNew(userDTO: UserDTO): Promise<UserDTO> {
      if (await this.findByfields({where: {email: userDTO.email}})) {
        throw new BadRequestException('A User is already registered with this email');
      }
      if (await this.findByfields({where: {login: userDTO.login}})) {
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
      if (await this.findByfields({where: {email: userDTO.email}})) {
        throw new BadRequestException('A User is already registered with this email');
      }
      if (await this.findByfields({where: {login: userDTO.login}})) {
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
      if (SecurityUtils.getCurrentUserLoggedIn() && SecurityUtils.getCurrentUserLoggedIn().id) {
        const existingUser: IUser = await this.findByfields({where: {email: userDTO.email}});
        if (existingUser && existingUser.id !== SecurityUtils.getCurrentUserLoggedIn().id) {
          throw new BadRequestException('Email Already exists.');
        }
        const currentUser = await this.userRepository.findOne(SecurityUtils.getCurrentUserLoggedIn().id);
        if (currentUser) {
          currentUser.email = userDTO.email;
          currentUser.firstName = userDTO.firstName;
          currentUser.lastName = userDTO.lastName;
          await this.userRepository.update(currentUser.id, currentUser);
          return this.userMapper.mapUserToUserDTO(currentUser);
        }
      }
      throw new BadRequestException('Invalid id.');
    }

    async activateAccount(activationKey: string): Promise<void> {
      const user = await this.findByfields({where: {activationKey}});
      if (!user) {
        throw new BadRequestException('Either the key is invalid or expired.');
      }
      user.activated = true;
      user.activationKey = null;
      await this.userRepository.update(user.id, user);
    }

    async resetPasswordInit(email: string): Promise<IUser> {
      const user = await this.findByfields({where: {email}});
      if (!user) {
        throw new BadRequestException('This email doesn\'t exist.');
      }
      user.resetKey = randomString.generate({
        length: 15,
        charset: 'numeric',
      });
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 1);
      user.resetDate = resetDate;
      await this.userRepository.update(user.id, user);
      return user;
    }

    async passwordResetFinish(resetKey: string, newPassword: string): Promise<void> {
      const user: IUser = await this.findByfields({where: {resetKey}});
      if (!user) {
        throw new BadRequestException('Invalid Reset password link');
      }
      const currentDate = new Date();
      const userResetDate = new Date(user.resetDate);
      if (user.resetKey && userResetDate > currentDate) {
        user.resetDate = null;
        user.resetKey = null;
        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(user.id, user);
      } else {
        throw new BadRequestException('The reset password link has expired. Your password couldn\'t be reset. Remember a password request is only valid for 24 hours.');
      }
    }

    async changePassword(newPassword: string, oldPassword: string): Promise<void> {
      if (oldPassword === newPassword) {
        throw new BadRequestException('Old Password and New password cannot be same');
      }
      const user = await this.findOneWithAuthorities();
      if (user && await this.validatePassword(oldPassword, user)) {
        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(user.id, user);
        return;
      }
      throw new BadRequestException('Invalid old password.');
    }

    async findAllManagedUsers(): Promise<UserDTO[]> {
      const users: IUser[] = await this.userRepository.find();
      return this.userMapper.mapUserToUserDTOList(users);
    }

    async findOneWithAuthoritiesById(id: number): Promise<UserDTO> {
      const user: IUser = await this.userRepository.findOne(id);
      if (user) {
        return this.userMapper.mapUserToUserDTO(user);
      }
      throw new BadRequestException('Invalid Id.');
    }

    async findOneWithAuthoritiesByEmail(email: string): Promise<UserDTO> {
      const user: IUser = await this.findByfields({where: {email}});
      if (user) {
        return this.userMapper.mapUserToUserDTO(user);
      }
      throw new BadRequestException('Invalid Email.');
    }

    async findOneWithAuthorities(): Promise<IUser> {
      if (SecurityUtils.getCurrentUserLoggedIn()) {
        return await this.userRepository.findOne(SecurityUtils.getCurrentUserLoggedIn().id);
      }
      return null;
    }

    async findOneWithAuthoritiesByEmailOrLogin(email: string): Promise<IUser> {
      return await this.findByfields({where: [{email}, {login: email}]});
    }

    async findOneWithAuthoritiesByLogin(login: string): Promise<UserDTO> {
      const user: IUser = await this.findByfields({where: {login}});
      if (user) {
        return this.userMapper.mapUserToUserDTO(user);
      }
      throw new BadRequestException('Invalid Login.');
    }

    async deleteUser(id: number): Promise<void> {
      await this.userRepository.delete(id);
    }

    private async validatePassword(password: string, user: IUser): Promise<boolean> {
      return await bcrypt.compare(password, user.password);
    }

    private async findByfields(options: FindOneOptions<User>): Promise<User | undefined> {
      options.relations = ['authorities'];
      return  await this.userRepository.findOne(options);
    }
<%}%>
}

<% if (dbType === 'mongodb') {%>import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {IUser, User} from './user.interface';
import {Model} from 'mongoose';<%}%><% if (dbType === 'mysql') {%>
import {EntityRepository, FindOneOptions, getRepository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {User} from './user.model';<%}%>

<%if (dbType === 'mongodb') {%>@Injectable()<%}%><%if (dbType === 'mysql') {%>@EntityRepository(User)<%}%>
export class UserRepository {<%if (dbType === 'mongodb') {%>

    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }<%}%>

    async save(user: <%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>): Promise<User> {<%if (dbType === 'mongodb') {%>
      const newUser = new this.userModel(user);
      return newUser.save();<%}%><%if (dbType === 'mysql') {%>
      if (user.id) {
        return this.update(user);
      }
      user.password = await this.encodePassword(user.password);
      return getRepository(User).save(user);<%}%>
    }

    async update(user: <%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>): Promise<<%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>> {<%if (dbType === 'mongodb') {%>
      return await this.userModel.findByIdAndUpdate(user.id, user , {new: true});<%}%><%if (dbType === 'mysql') {%>
          const actualRelationships = await getRepository(User)
            .createQueryBuilder()
            .relation(User, 'authorities')
            .of(user).loadMany();
          await getRepository(User)
            .createQueryBuilder()
            .relation(User, 'authorities')
            .of(user)
            .addAndRemove(user.authorities, actualRelationships);
          delete user.authorities;
          await getRepository(User)
            .createQueryBuilder()
            .relation(User, 'authorities')
            .update({
              ...user
            }).where('id = :id', {id: user.id}).execute();
          return await this.findOneByOptions({where: {id: user.id}});<%}%>
    }

    async findAll(): Promise<<%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>[]> {
    <%if (dbType === 'mongodb') {%>return await this.userModel.find();<%}%><%if (dbType === 'mysql') {%>return await getRepository(User).find();<%}%>
    }

    async findById(id: <%if (dbType === 'mongodb') {%>string<%}%><%if (dbType === 'mysql') {%>number<%}%>): Promise<<%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>> {
      <%if (dbType === 'mongodb') {%>return await this.userModel.findById(id);<%}%><%if (dbType === 'mysql') {%>return await this.findOneByOptions({where: {id}});<%}%>
    }

    async deleteById(id: <%if (dbType === 'mongodb') {%>string<%}%><%if (dbType === 'mysql') {%>number<%}%>): Promise<void> {
      <%if (dbType === 'mongodb') {%> await this.userModel.findByIdAndDelete(id);<%}%><%if (dbType === 'mysql') {%> await getRepository(User).delete(id);<%}%>
    }

    async findByEmail(email: string): Promise<<%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>> {
      <%if (dbType === 'mongodb') {%>return await this.userModel.findOne({email});<%}%><%if (dbType === 'mysql') {%>return await this.findOneByOptions({where: {email}});<%}%>
    }

    async findByActivationKey(activationKey: string): Promise<<%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>> {
      <%if (dbType === 'mongodb') {%>return await this.userModel.findOne({activationKey});<%}%><%if (dbType === 'mysql') {%>return await this.findOneByOptions({where: {activationKey}});<%}%>
    }

    async findByResetKey(resetKey: string): Promise<<%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>> {
      <%if (dbType === 'mongodb') {%>return await this.userModel.findOne({resetKey});<%}%><%if (dbType === 'mysql') {%>return await this.findOneByOptions({where: {resetKey}});<%}%>
    }

    async findByEmailOrLogin(email: string): Promise<<%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>> {
      <%if (dbType === 'mongodb') {%>return await this.userModel.findOne({$or: [{email}, {login: email}]});<%}%><%if (dbType === 'mysql') {%>return await this.findOneByOptions({where: [{email}, {login: email}]});<%}%>
    }

    async findByLogin(login: string): Promise<<%if (dbType === 'mongodb') {%>IUser<%}%><%if (dbType === 'mysql') {%>User<%}%>> {
      <%if (dbType === 'mongodb') {%>return await this.userModel.findOne({login});<%}%><%if (dbType === 'mysql') {%>return await this.findOneByOptions({where: {login}});<%}%>
    }<% if (dbType === 'mysql') {%>

    private async encodePassword(password): Promise<string> {
      return await bcrypt.hash(password, 12);
    }

    private async findOneByOptions(options: FindOneOptions): Promise<User> {
      options.relations = ['authorities'];
      return await getRepository(User).findOne(options);
    }<%}%>
}

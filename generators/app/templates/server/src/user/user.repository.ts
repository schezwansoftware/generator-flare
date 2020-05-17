<% if (dbType === 'mongodb') {%>import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {IUser, User} from './user.interface';
import {Model} from 'mongoose';

@Injectable()
export class UserRepository {

constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async save(user: IUser): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async update(user: IUser): Promise<IUser> {
        return await this.userModel.findByIdAndUpdate(user.id, user , {new: true});
    }

    async findAll(): Promise<IUser[]> {
        return await this.userModel.find();
    }

    async findById(id: string): Promise<IUser> {
        return await this.userModel.findById(id);
    }

    async deleteById(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }

    async findByEmail(email: string): Promise<IUser> {
        return await this.userModel.findOne({email});
    }

    async findByEmailOrLogin(email: string): Promise<IUser> {
        return await this.userModel.findOne({$or: [{email}, {login: email}]});
    }

    async findByLogin(login: string): Promise<IUser> {
        return await this.userModel.findOne({login});
    }
}
<%}%><% if (dbType === 'mysql') {%>import {Injectable} from '@nestjs/common';
import {FindOneOptions, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.model';
import {IUser} from './user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {

   constructor(
        @InjectRepository(User)
        private readonly userModel: Repository<User>,
   ) {}

    async save(user: IUser): Promise<User> {
        user.password = this.encryptPassword(user.password);
        return await this.userModel.save(user);
    }

    async update(user: IUser): Promise<IUser> {
        user.password = this.encryptPassword(user.password);
        await this.userModel.update(user.id, user);
        return await this.userModel.findOne(user.id);
    }

    async findAll(): Promise<IUser[]> {
        return await this.userModel.find();
    }

    async findById(id: number): Promise<IUser> {
        return await this.userModel.findOne(id);
    }

    async deleteById(id: number): Promise<void> {
        await this.userModel.delete(id);
    }

   async findByEmail(email: string): Promise<IUser> {
        return await this.userModel.findOne({email});
    }

    async findByEmailOrLogin(email: string): Promise<User> {
        const options: FindOneOptions = {
            relations: ['authorities'],
            where: [
                {login: email},
                {email},
            ],
        };
        return await this.userModel.findOne(options);
    }

    async findByLogin(login: string): Promise<User> {
        return await this.userModel.findOne({login});
    }

    private encryptPassword(password: string) {
      return  bcrypt.hashSync(password, 10);
    }
}
<%}%>

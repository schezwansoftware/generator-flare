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

    async findByActivationKey(activationKey: string): Promise<IUser> {
      return await this.userModel.findOne({activationKey});
    }

    async findByResetKey(resetKey: string): Promise<IUser> {
      return await this.userModel.findOne({resetKey});
    }

    async findByEmailOrLogin(email: string): Promise<IUser> {
        return await this.userModel.findOne({$or: [{email}, {login: email}]});
    }

    async findByLogin(login: string): Promise<IUser> {
        return await this.userModel.findOne({login});
    }
}
<%}%><% if (dbType === 'mysql') {%>import {Repository, EntityRepository} from 'typeorm';
import {User} from './user.model';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
}
<%}%>

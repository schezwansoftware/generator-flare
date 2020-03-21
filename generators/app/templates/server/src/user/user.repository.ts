import {Injectable} from '@nestjs/common';
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

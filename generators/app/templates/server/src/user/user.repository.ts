import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User} from './user.interface';
import {Model} from 'mongoose';
import {UserDTO} from './user.dto';

@Injectable()
export class UserRepository {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async save(userDTO: UserDTO): Promise<User> {
        const newUser = new this.userModel(userDTO);
        return newUser.save();
    }

    async update(userDTO: UserDTO): Promise<User> {
        return await this.userModel.findByIdAndUpdate(userDTO.id, userDTO , {new: true});
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find();
    }

    async findById(id: string): Promise<User> {
        return await this.userModel.findById(id);
    }

    async deleteById(id: string): Promise<void> {
       await this.userModel.findByIdAndDelete(id);
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({email});
    }

    async findByLogin(login: string): Promise<User> {
        return await this.userModel.findOne({login});
    }
}

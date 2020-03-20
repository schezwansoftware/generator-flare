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

}

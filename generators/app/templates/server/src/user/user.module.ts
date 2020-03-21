import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './user.model';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserMapper} from './user.mapper';
import {UserRepository} from './user.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ],
    providers: [UserService, UserMapper, UserRepository],
    controllers: [UserController],
    exports: [UserService, UserMapper],
})
export class UserModule {}

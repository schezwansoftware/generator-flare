<%if (dbType === 'mongodb'){%>import { Module } from '@nestjs/common';
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
    exports: [UserService, UserMapper, UserRepository],
})
export class UserModule {}
<%}%><%if (dbType === 'mysql'){%>import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserMapper} from './user.mapper';
import {UsersRepository} from './user.repository';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user.model';
import {Authority} from './authority/authority.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Authority]),
    ],
    providers: [UserService, UserMapper, UsersRepository],
    controllers: [UserController],
    exports: [UserService, UserMapper, UsersRepository],
})
export class UserModule {
}
<%}%>

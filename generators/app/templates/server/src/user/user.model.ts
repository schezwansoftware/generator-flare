<%if (dbType === 'mongodb') {%>import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import {User} from './user.interface';

export const UserSchema = new mongoose.Schema({
    firstName: {type: String, min: 5},
    lastName: {type: String, min: 5},
    login: {type: String, min: 5, required: true},
    email: {type: String, min: 5, max: 100, required: true},
    password: {type: String, min: 5, max: 100, required: true},
    authorities: {type: [String], required: true},
    resetKey: String,
    resetDate: {type: String, default: Date.now()},
});


// tslint:disable-next-line:only-arrow-functions
UserSchema.pre<User>('save', function(next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next();
});
<%}%><%if (dbType === 'mysql') {%>import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';
import {IsEmail, MinLength, MaxLength} from 'class-validator';
import {Authority} from './authority/authority.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 500})
    @MinLength(5)
    @MaxLength(100)
    firstName: string;

    @Column({length: 500, nullable: true})
    @MinLength(5)
    @MaxLength(100)
    lastName: string;

    @Column({length: 500})
    @MinLength(5)
    @MaxLength(100)
    login: string;

    @Column({length: 500})
    @IsEmail()
    email: string;

    @Column({length: 500})
    password: string;

    @Column({length: 500, nullable: true})
    resetKey: string;

    @Column({nullable: true})
    resetDate: Date;

    @ManyToMany(type => Authority)
    @JoinTable({
        name: 'user_authority',
        joinColumn: {name: 'user_id', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'authority_name', referencedColumnName: 'name'},
    })
    authorities: Authority[];
}
<%}%>

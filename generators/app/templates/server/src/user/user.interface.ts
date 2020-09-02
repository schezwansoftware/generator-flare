<% if (dbType === 'mongodb') {%>import { Document } from 'mongoose';

export interface IUser {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly login: string;
    readonly authorities: string[];
    resetDate: Date;
    activationKey: string;
    activated: boolean;
    resetKey: string;
    password: string;
}

export class User extends Document implements IUser {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly login: string;
    password: string;
    readonly authorities: string[];
    readonly resetDate: Date;
    readonly activationKey: string;
    readonly activated: boolean;
    readonly resetKey: string;
}

<%}%><% if (dbType === 'mysql') {-%>import {User} from './user.model';
import {Authority} from './authority/authority.entity';

export interface IUser extends User {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    email: string;
    password: string;
    resetKey: string;
    resetDate: Date;
    authorities: Authority[];
}
<%}-%>

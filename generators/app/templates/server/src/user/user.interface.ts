import { Document } from 'mongoose';

export interface IUser {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly login: string;
    readonly password: string;
    readonly authorities: string[];
    readonly resetDate: Date;
    readonly resetKey: string;
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
    readonly resetKey: string;
}

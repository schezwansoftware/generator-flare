import { Document } from 'mongoose';

export interface IUser {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly login: string;
    readonly authorities: string[];
    resetDate: Date;
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
    readonly resetKey: string;
}

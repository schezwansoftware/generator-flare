import { Document } from 'mongoose';

export interface User extends Document {
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

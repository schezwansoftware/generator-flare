import * as mongoose from 'mongoose';
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


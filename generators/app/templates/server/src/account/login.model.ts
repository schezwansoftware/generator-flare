import {IsNotEmpty} from 'class-validator';

export class LoginVM {

    @IsNotEmpty()
    readonly username: string;

    @IsNotEmpty()
    readonly password: string;

}

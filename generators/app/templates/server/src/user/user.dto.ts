import {IsEmail, IsNotEmpty, MaxLength, Min, MinLength} from 'class-validator';

export class UserDTO {
    readonly id: string;

    @MinLength(3)
    @MaxLength(100)
    readonly firstName: string;

    @MinLength(3)
    @MaxLength(100)
    readonly lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
    readonly email: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    readonly login: string;

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(100)
    readonly password: string;

    @IsNotEmpty()
    readonly authorities: string[];

    readonly resetDate: Date;

    readonly resetKey: string;
}

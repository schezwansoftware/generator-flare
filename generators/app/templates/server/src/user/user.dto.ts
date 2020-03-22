import {IsEmail, IsNotEmpty, MaxLength, Min, MinLength} from 'class-validator';

export class UserDTO {
    id: string;

    @MinLength(3)
    @MaxLength(100)
    firstName: string;

    @MinLength(3)
    @MaxLength(100)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
    email: string;

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    login: string;

    authorities: string[];
}

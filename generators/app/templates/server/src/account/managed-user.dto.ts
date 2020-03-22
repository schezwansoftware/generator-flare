import {UserDTO} from '../user/user.dto';
import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';

export class ManagedUserVM extends UserDTO {

    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(4)
    readonly password: string;
}

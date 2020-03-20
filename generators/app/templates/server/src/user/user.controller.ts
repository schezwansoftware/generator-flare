import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {UserService} from './user.service';
import {UserDTO} from './user.dto';

@Controller('api/users')
export class UserController {

    constructor(private userService: UserService) {
    }

    // add a user
    @Post('/create')
    async addCustomer(@Res() res, @Body() userDTO: UserDTO) {
        const result: UserDTO = await this.userService.createNew(userDTO);
        return res.status(HttpStatus.OK).json({
            message: `User with identifier ${userDTO.login} has been created succesfully`,
            result,
        });
    }
}

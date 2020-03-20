import {BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res} from '@nestjs/common';
import {UserService} from './user.service';
import {UserDTO} from './user.dto';
import * as mongoose from 'mongoose';

@Controller('api')
export class UserController {

    constructor(private userService: UserService) {
    }

    // add a user
    @Post('/users')
    async createUser(@Res() res, @Body() userDTO: UserDTO) {
        if (userDTO.id) {
            throw new BadRequestException('A user cannot already have an id.');
        }
        const result: UserDTO = await this.userService.createNew(userDTO);
        return res.status(HttpStatus.OK).json({
            message: `User with identifier ${userDTO.login} has been created succesfully`,
            result,
        });
    }

    // add a user
    @Put('/users')
    async updateUser(@Res() res, @Body() userDTO: UserDTO) {
        if (!userDTO.id) {
            throw new BadRequestException('A user must have an id.');
        } else if (!mongoose.Types.ObjectId.isValid(userDTO.id)) {
            throw new BadRequestException('Invalid Id.');
        }
        const result: UserDTO = await this.userService.updateUser(userDTO);
        return res.status(HttpStatus.OK).json({
            message: `User with identifier ${userDTO.login} has been updated succesfully`,
            result,
        });
    }

    // add a user
    @Get('/users')
    async getAllManagedUsers(@Res() res) {
        const result = await this.userService.findAllManagedUsers();
        return res.status(HttpStatus.OK).json({result});
    }

    // add a user
    @Get('/users/:id')
    async getUser(@Res() res, @Param() params: any) {
        const id: string = params.id;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            const result = await this.userService.findOneWithAuthoritiesById(id);
            return res.status(HttpStatus.OK).json({result});
        }
        throw new BadRequestException('Invalid id.');
    }

    // add a user
    @Delete('/users/:id')
    async deleteUser(@Res() res, @Param() params: any) {
        const id: string = params.id;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            await this.userService.deleteUser(id);
            return res.status(HttpStatus.OK).json({message: `User with identifier ${id} has been deleted succesfully`});
        }
        throw new BadRequestException('Invalid id.');
    }
}

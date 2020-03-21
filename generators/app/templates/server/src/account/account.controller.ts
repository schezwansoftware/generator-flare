import {BadRequestException, Body, Controller, Get, HttpStatus, Post, Res} from '@nestjs/common';
import {LoginVM} from './login.model';
import {JWTToken} from '../auth/jwt/token.model';
import {AccountService} from './account.service';
import {UserDTO} from '../user/user.dto';
import {Public} from '../auth/decorators/public.decorator';

@Controller('api')
export class AccountController {

    constructor(private accountService: AccountService) {
    }

    @Post('authenticate')
    @Public()
    async createUser(@Res() res, @Body() loginVM: LoginVM) {
        const result: JWTToken = await this.accountService.authenticate(loginVM);
        return res.status(HttpStatus.OK).json({
            result,
        });
    }

    @Get('account')
    async getAccount(@Res() res) {
        const result: UserDTO = await this.accountService.getAccount();
        return res.status(HttpStatus.OK).json({
            result,
        });
    }
}

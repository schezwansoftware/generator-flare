import {Body, Controller, Get, HttpStatus, Post, Res, Put, Param} from '@nestjs/common';
import {LoginVM} from './login.model';
import {JWTToken} from '../auth/jwt/token.model';
import {AccountService} from './account.service';
import {UserDTO} from '../user/user.dto';
import {Public} from '../auth/decorators/public.decorator';
import {ManagedUserVM} from './managed-user.dto';

@Controller('api')
export class AccountController {

    constructor(private accountService: AccountService) {
    }

    @Post('register')
    @Public()
    async register(@Res() res, @Body() managedUserVM: ManagedUserVM) {
        await this.accountService.register(managedUserVM, managedUserVM.password);
        return res.status(HttpStatus.CREATED).json({
            message: 'User has been registered.',
        });
    }
    @Post('authenticate')
    @Public()
    async authenticate(@Res() res, @Body() loginVM: LoginVM) {
        const result: JWTToken = await this.accountService.authenticate(loginVM);
        return res.status(HttpStatus.OK).json({
            result,
        });
    }

  @Put('account/activate/:key')
  @Public()
  async activateAccount(@Res() res, @Param('key') activationKey: string) {
    await this.accountService.activateAccount(activationKey);
    return res.status(HttpStatus.OK).json({message: 'User has been activated'});
  }

    @Get('account')
    async getAccount(@Res() res) {
        const result: UserDTO = await this.accountService.getAccount();
        return res.status(HttpStatus.OK).json({
            result,
        });
    }
}

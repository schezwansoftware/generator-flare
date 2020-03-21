import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import {UserModule} from '../user/user.module';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}

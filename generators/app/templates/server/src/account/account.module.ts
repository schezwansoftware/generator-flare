import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import {UserModule} from '../user/user.module';
import {AuthModule} from '../auth/auth.module';
import {SharedModule} from '../shared/shared.module';

@Module({
  imports: [UserModule, AuthModule, SharedModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}

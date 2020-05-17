import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import {MailerModule} from '@nestjs-modules/mailer';
import { SharedModule } from './shared/shared.module';
import { EntityModule } from './entity/entity.module';
import {MAIL_CONFIG} from './shared/config/mail/node-mailer.config';
<% if (dbType === 'mongodb') {-%>import {MongooseModule} from '@nestjs/mongoose';
<%}-%><% if (dbType === 'mysql') {-%>import {TypeOrmModule} from '@nestjs/typeorm';
import {DATABASE_CONFIG_OPTIONS} from './database/database.config';
import {Connection} from 'typeorm';
<%}-%>




@Module({
  imports: [
      ConfigModule.forRoot(),
<% if (dbType === 'mongodb') {-%>
      MongooseModule.forRoot(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }),
<%}-%>
<% if (dbType === 'mysql') {-%>
      TypeOrmModule.forRoot(DATABASE_CONFIG_OPTIONS),
<%}-%>
      MailerModule.forRoot(MAIL_CONFIG),
      UserModule,
      AccountModule,
      EntityModule,
      AuthModule,
      SharedModule,
  ],
})
<% if (dbType === 'mongodb') {-%>
export class AppModule {}
<%}-%><% if (dbType === 'mysql') {-%>
export class AppModule {
    constructor(private readonly connection: Connection) {}
}
<%}-%>

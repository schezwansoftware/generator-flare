import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import {MailerModule, PugAdapter} from '@nestjs-modules/mailer';
import { SharedModule } from './shared/shared.module';
import { EntityModule } from './entity/entity.module';


@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }),
      MailerModule.forRoot({
          transport: {
              host: process.env.MAIL_HOST,
              port: process.env.MAIL_PORT,
              secure: false, // upgrade later with STARTTLS
              auth: {
                  user: process.env.MAIL_USERNAME,
                  pass: process.env.MAIL_PASSWORD,
              },
          },
          defaults: {
              from: process.env.MAIL_FROM,
          },
          template: {
              dir: 'src/templates/mail',
              adapter: new PugAdapter(), // or new PugAdapter()
              options: {
                  strict: true,
              },
          },
      }),
      UserModule,
      AccountModule,
      EntityModule,
      AuthModule,
      SharedModule,
  ],
})
export class AppModule {}

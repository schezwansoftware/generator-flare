import {Injectable} from '@nestjs/common';
import {IUser} from '../../user/user.interface';
import {MAIL_BASE_URL, MAIL_FROM} from '../../app.constants';
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService) {}

  private async sendEmailFromTemplate(email: string, context: any, template: string, subject: string): Promise<void> {
    this.mailerService.sendMail({
      to: email,
      from: MAIL_FROM,
      template,
      context,
      subject,
    });
  }

  async sendCreationEmail(user: IUser): Promise<void> {
    const userName = user.firstName || user.login;
    const url = `${MAIL_BASE_URL}/activate?key=${user.activationKey}`;
    return await this.sendEmailFromTemplate(user.email, {userName, url}, 'welcome', 'User Creation Email');
  }

  async sendPasswordResetEmail(user: IUser): Promise<void> {
    const userName = user.firstName || user.login;
    const url = `${MAIL_BASE_URL}/password-reset/finish?key=${user.resetKey}`;
    return await this.sendEmailFromTemplate(user.email, {userName, url}, 'passwordReset', 'User Password Reset Email');  }
}

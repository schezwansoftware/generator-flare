import {Injectable} from '@nestjs/common';
import {IUser} from '../../user/user.interface';
import {MAIL_FROM} from '../../app.constants';
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) {}

    private async sendEmailFromTemplate(user: IUser, template: string, subject: string): Promise<void> {
        this.mailerService.sendMail({
            to: user.email,
            from: MAIL_FROM,
            template: 'welcome',
            context: {user},
            subject,
        });
    }

    async sendCreationEmail(user: IUser): Promise<void> {
        return await this.sendEmailFromTemplate(user, 'welcome', 'User Creation Email');
    }
}

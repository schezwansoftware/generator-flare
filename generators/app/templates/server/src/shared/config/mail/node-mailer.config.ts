import {PugAdapter} from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

export const MAIL_CONFIG = {
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
};

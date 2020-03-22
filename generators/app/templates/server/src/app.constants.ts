export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRY_TIME_IN_SECONDS: number = Number(process.env.JWT_EXPIRY_TIME_IN_SECONDS) || 86400;
export const MAIL_HOST: string = process.env.MAIL_HOST || 'smtp.gmail.com';
export const MAIL_PORT: string = process.env.MAIL_PORT;
export const MAIL_USERNAME: string = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD: string = process.env.MAIL_PASSWORD;
export const MAIL_FROM: string = process.env.MAIL_FROM;
export const MAIL_BASE_URL: string = process.env.MAIL_BASE_URL;

export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRY_TIME_IN_SECONDS: number = Number(process.env.JWT_EXPIRY_TIME_IN_SECONDS) || 86400;
export const MAIL_HOST: string = process.env.MAIL_HOST || 'smtp.gmail.com';
export const MAIL_PORT: string = process.env.MAIL_PORT;
export const MAIL_USERNAME: string = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD: string = process.env.MAIL_PASSWORD;
export const MAIL_FROM: string = process.env.MAIL_FROM;
export const MAIL_BASE_URL: string = process.env.MAIL_BASE_URL || 'http://localhost:<%= appPort %>';
<% if (dbType === 'mysql') {%>export const DB_USER: string = process.env.DB_USER || 'root';
export const DB_HOST: string = process.env.DB_HOST || 'localhost';
export const DB_PORT: string = process.env.DB_PORT || '3306';
export const DB_PASSWORD: string = process.env.DB_PASSWORD ;
export const DB_NAME: string = process.env.DB_NAME || '<%= appName %>';
<%}%>

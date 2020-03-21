export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRY_TIME_IN_SECONDS: number = Number(process.env.JWT_EXPIRY_TIME_IN_SECONDS) || 86400;

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh";

export const SMTP_HOST = process.env.SMTP_HOST || "localhost";
export const SMTP_PORT = Number(process.env.SMTP_PORT) || 1025;
export const SMTP_USERNAME = process.env.SMTP_USERNAME || "Voucher Application";
export const SMTP_USER = process.env.SMTP_USER || "sender@mailhog.com";
export const SMTP_PASS = process.env.SMTP_PASS || "pass";
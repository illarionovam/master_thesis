import nodemailer from 'nodemailer';

const { EMAIL_HOST, EMAIL_PASS, EMAIL_USER, EMAIL_PORT } = process.env;

const config = {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
};

export const mailer = nodemailer.createTransport(config);

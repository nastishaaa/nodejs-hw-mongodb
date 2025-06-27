import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar';

const transporter = nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: getEnvVar('SMTP_PORT'),
    auth: {
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASSWORD'),
    },
});

export const sendMail = async (options) => {
    return await transporter.sendMail(options);
}
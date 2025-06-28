import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: Number(getEnvVar('SMTP_PORT')),
    secure: false,
    auth: {
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASSWORD'),
    },
});

export const sendMail = async (options) => {
    return await transporter.sendMail(options);
}
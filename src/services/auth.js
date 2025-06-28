import { User } from "../db/models/user.js";
import { Session } from "../db/models/session.js";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { getEnvVar } from "../utils/getEnvVar.js";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";
import { sendMail } from "../utils/sendMail.js";

export const registerUser = async (payload) => {
    const userEmail = await User.findOne({ email: payload.email });
    if (userEmail) {
        throw createHttpError(409, 'Email in use');
    }
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return await User.create({
        ...payload,
        password: encryptedPassword
    });
}

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(401, 'User not found');
    }

    const isEqual = await bcrypt.compare(payload.password, user.password); 
    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await Session.deleteOne({ userId: user._id });
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
}

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    };
};

export const refreshUser = async ({ sessionId, refreshToken }) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken,
    });
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    
    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();
    await Session.deleteOne({ _id: sessionId, refreshToken });

    return await Session.create({
        userId: session.userId,
        ...newSession,
    });
}

export const logoutUser = async (sessionId) => {
    await Session.deleteOne({ _id: sessionId });
    
}

export const sendResetEmailUser = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    
    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        getEnvVar('JWT_SECRET'), 
        { expiresIn: '5m'},
    );

    const frontendLink = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`;

    try {
        await sendMail({
            from: getEnvVar('SMTP_FROM'),
            to: email,
            subject: 'Reset your password',
            html: `<p>Click <a href="${frontendLink}">here</a> to reset your password!</p>`,
        });

    } catch {
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
}

export const resetUserPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'))
    } catch (error) {
        if (error instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
        throw error;
    }

    const user = await User.findOne({ email: entries.email, _id: entries.sub });
    if (!user) throw createHttpError(404, 'User not found');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    await User.updateOne(
        {_id: user._id},
        {password: encryptedPassword},
    );

    await Session.deleteOne({ _id: entries.user._id });
}
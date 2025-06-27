import { registerUser, loginUser, refreshUser, logoutUser, sendResetEmailUser, resetUserPassword } from "../services/auth.js";
import { THIRTY_DAYS } from "../constants/index.js";
import { Session } from "../db/models/session.js";

export const registerUserController = async (req, res ) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    })
}

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
}

export const loginUserController = async (req, res) => {
    
    const session = await loginUser(req.body);

    setupSession(res, session);

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
        },
    });

}

export const refreshUserController = async (req, res) => {
    const session = await refreshUser({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        },
    });
}

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
}

export const sendResetEmailUserController = async (req, res) => {
    await sendResetEmailUser(req.body.email);

    res.status(200).json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {}
    });
    
};

export const resetUserPasswordController = async (req, res) => {
    await resetUserPassword(req.body);

    res.json({
        status: 200,
        message: "Password has been successfully reset.",
        data: {}
    })
}
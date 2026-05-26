import type { Response } from 'express';

export const setAuthCookie = (res: Response, token: string) => {
    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: oneDay,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
};

// export const clearAuthCookie = (res: Response) => {
//     res.cookie('token', 'logout', {
//         httpOnly: true,
//         expires: new Date(Date.now()),
//     });
// };

export const clearAuthCookie = (res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
};

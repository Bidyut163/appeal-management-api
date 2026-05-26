import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import {
    getCurrentUserService,
    loginService,
    signupService,
} from '../services/authService.js';
import { clearAuthCookie, setAuthCookie } from '../utils/authCookieUtils.js';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { token, user } = await loginService(email, password);

    setAuthCookie(res, token);

    return res.status(StatusCodes.OK).json({
        message: 'Login successful',
        user,
    });
};

export const signup = async (req: Request, res: Response) => {
    const user = await signupService(req.body);

    res.status(201).json(user);
};

export const logout = async (req: Request, res: Response) => {
    clearAuthCookie(res);
    res.status(StatusCodes.OK).json({ message: 'User logged out!' });
};

export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await getCurrentUserService(userId);
    res.json(user);
};

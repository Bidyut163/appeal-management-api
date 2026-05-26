import type { NextFunction, Request, Response } from 'express';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';
import { prismaClient } from '../server.js';

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { token } = req.cookies;
    if (!token) next(new UnauthenticatedError('authentication invalid'));

    try {
        const payload = verifyJWT(token);
        const user = await prismaClient.user.findUnique({
            where: { id: payload.userId },
            include: {
                roles: true,
            },
        });

        if (!user) {
            return next(new UnauthenticatedError('User not found'));
        }

        console.log(user);

        req.user = {
            userId: user.id,
            roles: user.roles.map((r) => r.name),
        };

        next();
    } catch (error) {
        next(new UnauthenticatedError('authentication invalid'));
    }
};

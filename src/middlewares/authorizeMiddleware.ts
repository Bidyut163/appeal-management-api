import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/customErrors.js';

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError('Unauthorized'));
        }

        const hasRole = req.user.roles.some((role) =>
            allowedRoles.includes(role),
        );

        if (!hasRole) {
            return next(new UnauthorizedError('Forbidden'));
        }

        next();
    };
};

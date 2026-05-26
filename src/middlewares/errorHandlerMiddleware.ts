import { StatusCodes } from 'http-status-codes';
import type { NextFunction, Request, Response } from 'express';

const errorHandlerMiddleware = (
    err: { statusCode: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(err);

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
        err.message || 'Something went wrong, please try again later';

    res.status(statusCode).json({ message });
};

export default errorHandlerMiddleware;

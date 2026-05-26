import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// services
import {
    getUnderVerificationAppealService,
    getUnderVerificationAppealsService,
    verifyAppealService,
} from '../services/verifierService.js';

export const verifyAppeal = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);
    const { verifierComment } = req.body;

    const appeal = await verifyAppealService(appealId, verifierComment);

    return res.status(StatusCodes.OK).json(appeal);
};

export const getUnderVerificationAppeals = async (
    req: Request,
    res: Response,
) => {
    const appeals = await getUnderVerificationAppealsService();

    return res.status(StatusCodes.OK).json(appeals);
};

export const getUnderVerificationAppeal = async (
    req: Request,
    res: Response,
) => {
    const appealId = Number(req.params.id);
    const appeal = await getUnderVerificationAppealService(appealId);

    return res.status(StatusCodes.OK).json(appeal);
};

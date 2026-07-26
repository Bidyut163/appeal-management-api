import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
    createAppealService,
    getAllAppealsService,
    getAppealService,
    resubmitAppealService,
} from '../services/appealService.js';
import { BadRequestError } from '../errors/customErrors.js';

export const getAllAppeals = async (req: Request, res: Response) => {
    const appeals = await getAllAppealsService(req.user!.userId);

    return res.status(StatusCodes.OK).json(appeals);
};

export const createAppeal = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    if (!req.file) {
        throw new BadRequestError('Appeal document is required.');
    }
    const appeal = await createAppealService(userId, req.body, req.file);

    return res.status(StatusCodes.CREATED).json(appeal);
};

export const getAppeal = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const appealId = Number(req.params.id);

    const appeal = await getAppealService(userId, appealId);

    return res.status(StatusCodes.OK).json(appeal);
};

export const resubmitAppeal = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const appealId = Number(req.params.id);

    const appeal = await resubmitAppealService(userId, appealId, req.body);

    return res.status(StatusCodes.OK).json(appeal);
};

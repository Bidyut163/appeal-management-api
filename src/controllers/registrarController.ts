import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
    createAppealChecklistService,
    getWithRegistrarAppealService,
    getWithRegistrarAppealsService,
    revertAppealService,
    sendAppealToHearingService,
} from '../services/registrarService.js';

export const getWithRegistrarAppeals = async (req: Request, res: Response) => {
    const appeals = await getWithRegistrarAppealsService();

    return res.status(StatusCodes.OK).json(appeals);
};

export const getWithRegistrarAppeal = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);
    const appeal = await getWithRegistrarAppealService(appealId);

    return res.status(StatusCodes.OK).json(appeal);
};

export const revertAppeal = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);
    const { registrarComment } = req.body;

    const appeal = await revertAppealService(appealId, registrarComment);

    return res.status(StatusCodes.OK).json(appeal);
};

export const createAppealChecklist = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);

    const checklist = await createAppealChecklistService(appealId, req.body);

    return res.status(StatusCodes.CREATED).json(checklist);
};

export const sendAppealToHearing = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);

    const appeal = await sendAppealToHearingService(appealId);

    return res.status(StatusCodes.OK).json(appeal);
};

import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
    completeHearingService,
    createAppealChecklistService,
    getAppealsUnderHearingService,
    getAppealUnderHearingService,
    getWithRegistrarAppealService,
    getWithRegistrarAppealsService,
    revertAppealService,
    scheduleNextHearingService,
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
    const userId = req.user!.userId;
    // const { registrarComment } = req.body;
    const { revertReason, fields } = req.body;

    const appeal = await revertAppealService(appealId, userId, {
        revertReason,
        fields,
    });

    return res.status(StatusCodes.OK).json(appeal);
};

export const createAppealChecklist = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);

    const checklist = await createAppealChecklistService(appealId, req.body);

    return res.status(StatusCodes.CREATED).json(checklist);
};

export const sendAppealToHearing = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);

    const appeal = await sendAppealToHearingService(appealId, req.body);

    return res.status(StatusCodes.OK).json(appeal);
};

export const completeHearing = async (req: Request, res: Response) => {
    const appealId = Number(req.params.appealId);
    const hearingId = Number(req.params.hearingId);

    const hearing = await completeHearingService(appealId, hearingId);

    return res.status(StatusCodes.OK).json(hearing);
};

export const scheduleNextHearing = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);
    const { hearingDate } = req.body;

    const hearing = await scheduleNextHearingService(appealId, hearingDate);

    return res.status(StatusCodes.OK).json(hearing);
};

export const getAppealsUnderHearing = async (req: Request, res: Response) => {
    const appeals = await getAppealsUnderHearingService();

    return res.status(StatusCodes.OK).json(appeals);
};

export const getAppealUnderHearing = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);

    const appeal = await getAppealUnderHearingService(appealId);

    return res.status(StatusCodes.OK).json(appeal);
};

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
    createOfficialService,
    getOfficialsService,
} from '../services/adminService.js';

export const getOfficials = async (req: Request, res: Response) => {
    const officials = await getOfficialsService();

    return res.status(StatusCodes.OK).json(officials);
};

export const createOfficial = async (req: Request, res: Response) => {
    const official = await createOfficialService(req.body);

    return res.status(StatusCodes.CREATED).json(official);
};

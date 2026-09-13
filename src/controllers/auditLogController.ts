import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAuditLogService } from '../services/auditLogService.js';

export const getAuditLogs = async (req: Request, res: Response) => {
    const appealId = Number(req.params.id);

    const auditLogs = await getAuditLogService(appealId);

    return res.status(StatusCodes.OK).json(auditLogs);
};

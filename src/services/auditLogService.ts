import type { AuditAction, Prisma } from '@prisma/client';
import { prismaClient } from '../server.js';
import { NotFoundError } from '../errors/customErrors.js';

type CreateAuditLogInput = {
    appealId?: number;
    userId?: number;
    action: AuditAction;
    details?: Prisma.InputJsonValue;
};

export const createAuditLogService = async (
    tx: Prisma.TransactionClient,
    { appealId, userId, action, details }: CreateAuditLogInput,
) => {
    const auditLog = await tx.auditLog.create({
        data: {
            action,
            ...(appealId !== undefined && { appealId }),
            ...(userId !== undefined && { userId }),
            ...(details !== undefined && { details }),
        },
    });

    return auditLog;
};

export const getAuditLogService = async (appealId: number) => {
    const appeal = await prismaClient.appeal.findUnique({
        where: { id: appealId },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found!');
    }

    const auditLogs = await prismaClient.auditLog.findMany({
        where: { appealId },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    roles: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return auditLogs;
};

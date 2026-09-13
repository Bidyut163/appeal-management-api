import type { AuditAction, Prisma } from '@prisma/client';

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

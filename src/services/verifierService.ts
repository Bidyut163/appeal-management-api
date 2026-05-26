import { AppealStatus } from '@prisma/client';
import { prismaClient } from '../server.js';
import { NotFoundError } from '../errors/customErrors.js';
import { validateTransition } from '../utils/workflow.js';

export const verifyAppealService = async (
    appealId: number,
    comment: string,
) => {
    const appeal = await prismaClient.appeal.findUnique({
        where: { id: appealId },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    validateTransition(appeal.status, AppealStatus.WITH_REGISTRAR);

    const updatedAppeal = await prismaClient.appeal.update({
        where: { id: appealId },
        data: {
            verifierComments: comment,
            status: AppealStatus.WITH_REGISTRAR,
        },
    });

    return updatedAppeal;
};

export const getUnderVerificationAppealsService = async () => {
    const appeals = await prismaClient.appeal.findMany({
        where: {
            status: AppealStatus.UNDER_VERIFICATION,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return appeals;
};

export const getUnderVerificationAppealService = async (appealId: number) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId, status: AppealStatus.UNDER_VERIFICATION },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    return appeal;
};

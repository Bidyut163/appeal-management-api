import { AppealStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { prismaClient } from '../server.js';
import { validateTransition } from '../utils/workflow.js';

export const getWithRegistrarAppealsService = async () => {
    const appeals = await prismaClient.appeal.findMany({
        where: {
            status: AppealStatus.WITH_REGISTRAR,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return appeals;
};

export const getWithRegistrarAppealService = async (appealId: number) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId, status: AppealStatus.WITH_REGISTRAR },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    return appeal;
};

export const revertAppealService = async (
    appealId: number,
    comment: string,
) => {
    const appeal = await prismaClient.appeal.findUnique({
        where: { id: appealId },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    validateTransition(appeal.status, AppealStatus.REVERTED_TO_APPELLANT);

    const updatedAppeal = await prismaClient.appeal.update({
        where: { id: appealId },
        data: {
            registrarComments: comment,
            status: AppealStatus.REVERTED_TO_APPELLANT,
        },
    });

    return updatedAppeal;
};

export const sendAppealToHearingService = async (appealId: number) => {
    const appeal = await prismaClient.appeal.findUnique({
        where: { id: appealId },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    validateTransition(appeal.status, AppealStatus.UNDER_HEARING);

    const updatedAppeal = await prismaClient.appeal.update({
        where: { id: appealId },
        data: {
            status: AppealStatus.UNDER_HEARING,
        },
    });

    return updatedAppeal;
};

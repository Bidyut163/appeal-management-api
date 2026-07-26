import { AppealDocumentType, AppealStatus } from '@prisma/client';
import { prismaClient } from '../server.js';

import { type CreateAppealInput } from '../validators/appealSchemas.js';
import { NotFoundError } from '../errors/customErrors.js';
import { validateTransition } from '../utils/workflow.js';

type UploadedFile = Express.Multer.File;

export const getAllAppealsService = async (userId: number) => {
    const appeals = await prismaClient.appeal.findMany({
        where: { appellantId: userId },
        orderBy: { createdAt: 'desc' },
    });

    return appeals;
};

export const createAppealService = async (
    userId: number,
    formData: CreateAppealInput,
    file: UploadedFile,
) => {
    return prismaClient.$transaction(async (tx) => {
        const appeal = await tx.appeal.create({
            data: {
                ...formData,
                status: AppealStatus.UNDER_VERIFICATION,
                appellantId: userId,
            },
        });

        await tx.appealDocument.create({
            data: {
                appealId: appeal.id,
                fileName: file.originalname,
                filePath: file.path,
                fileSize: file.size,
                documentType: AppealDocumentType.APPEAL,
            },
        });

        return appeal;
    });
};

export const getAppealService = async (userId: number, appealId: number) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId, appellantId: userId },
    });

    if (!appeal) throw new NotFoundError('Appeal not found');

    return appeal;
};

export const resubmitAppealService = async (
    userId: number,
    appealId: number,
    formData: CreateAppealInput,
) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId, appellantId: userId },
    });

    if (!appeal) throw new NotFoundError('Appeal not found');

    // if (appeal.status !== AppealStatus.REVERTED_TO_APPELLANT)
    //     throw new BadRequestError('Appeal cannot be resubmitted');

    validateTransition(appeal.status, AppealStatus.UNDER_VERIFICATION);

    const updatedAppeal = await prismaClient.appeal.update({
        where: { id: appealId },
        data: {
            ...formData,
            status: AppealStatus.UNDER_VERIFICATION,
        },
    });

    return updatedAppeal;
};

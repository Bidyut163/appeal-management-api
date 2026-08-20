import { AppealDocumentType, AppealStatus, RevertStatus } from '@prisma/client';
import { prismaClient } from '../server.js';

import { type CreateAppealInput } from '../validators/appealSchemas.js';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { validateTransition } from '../utils/workflow.js';
import {
    REVERTABLE_FIELDS,
    type RevertableField,
} from '../constants/appeal.js';

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
                status: AppealStatus.DRAFT,
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

export const getAppealRevertService = async (
    userId: number,
    appealId: number,
) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: {
            id: appealId,
            appellantId: userId,
            status: AppealStatus.REVERTED_TO_APPELLANT,
        },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    const revert = await prismaClient.appealRevert.findFirst({
        where: {
            appealId,
            status: RevertStatus.OPEN,
        },
    });

    if (!revert) {
        throw new NotFoundError('No open revert found');
    }

    return revert;
};

function setField<K extends keyof CreateAppealInput>(
    target: Partial<CreateAppealInput>,
    key: K,
    value: CreateAppealInput[K],
) {
    target[key] = value;
}

function isRevertableField(field: string): field is RevertableField {
    return REVERTABLE_FIELDS.includes(field as RevertableField);
}

export const resubmitAppealService = async (
    userId: number,
    appealId: number,
    formData: CreateAppealInput,
) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId, appellantId: userId },
    });

    if (!appeal) throw new NotFoundError('Appeal not found');

    if (appeal.status !== AppealStatus.REVERTED_TO_APPELLANT)
        throw new BadRequestError('Appeal cannot be resubmitted');

    validateTransition(appeal.status, AppealStatus.UNDER_VERIFICATION);

    const revertAppeal = await prismaClient.appealRevert.findFirst({
        where: { appealId, status: RevertStatus.OPEN },
    });

    if (!revertAppeal)
        throw new BadRequestError('No open appeal revert found.');

    const invalidFields = revertAppeal.fields.filter(
        (field) => !isRevertableField(field),
    );

    if (invalidFields.length > 0) {
        throw new BadRequestError('Invalid revert field.');
    }

    const fieldsToBeUpdated: Partial<CreateAppealInput> = {};

    for (const field of revertAppeal.fields) {
        const key = field as keyof CreateAppealInput;
        const value = formData[key];

        if (value === undefined) {
            throw new BadRequestError(
                `Missing value for reverted field: ${field}`,
            );
        }

        // below implementation is - To resove typescriot error type never
        setField(fieldsToBeUpdated, key, value);
    }

    return prismaClient.$transaction(async (tx) => {
        const updatedAppeal = await tx.appeal.update({
            where: { id: appealId },
            data: {
                ...fieldsToBeUpdated,
                status: AppealStatus.UNDER_VERIFICATION,
            },
        });

        await tx.appealRevert.update({
            where: { id: revertAppeal.id },
            data: {
                status: RevertStatus.RESUBMITTED,
            },
        });

        return updatedAppeal;
    });
};

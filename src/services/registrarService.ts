import { AppealStatus, AuditAction, HearingStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { prismaClient } from '../server.js';
import { validateTransition } from '../utils/workflow.js';

import * as z from 'zod';
import type {
    sendToHearingSchema,
    updateAppealScrutinySchema,
} from '../validators/appealSchemas.js';
import { createAuditLogService } from './auditLogService.js';

type UpdateAppealScrutinyInput = z.infer<typeof updateAppealScrutinySchema>;
type SendToHearingInput = z.infer<typeof sendToHearingSchema>;

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
        include: {
            appealChecklist: true,
        },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    return appeal;
};

type RevertAppealInput = {
    revertReason: string;
    fields: string[];
};
export const revertAppealService = async (
    appealId: number,
    userId: number,
    data: RevertAppealInput,
) => {
    const { revertReason, fields } = data;
    const appeal = await prismaClient.appeal.findUnique({
        where: { id: appealId },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    validateTransition(appeal.status, AppealStatus.REVERTED_TO_APPELLANT);

    return prismaClient.$transaction(async (tx) => {
        const appealRevert = await tx.appealRevert.create({
            data: {
                appealId,
                createdById: userId,
                reason: revertReason,
                fields,
            },
        });

        await tx.appeal.update({
            where: { id: appealId },
            data: {
                status: AppealStatus.REVERTED_TO_APPELLANT,
            },
        });

        await createAuditLogService(tx, {
            appealId,
            userId,
            action: AuditAction.APPEAL_REVERTED,
            details: {
                reason: revertReason,
                fields,
                status: AppealStatus.REVERTED_TO_APPELLANT,
            },
        });

        return appealRevert;
    });

    // return updatedAppeal;
};

export const updateAppealScrutinyService = async (
    appealId: number,
    formData: UpdateAppealScrutinyInput,
) => {
    return await prismaClient.$transaction(async (tx) => {
        const appeal = await tx.appeal.findFirst({
            where: { id: appealId, status: AppealStatus.WITH_REGISTRAR },
        });

        if (!appeal) {
            throw new NotFoundError(
                'Appeal not found or not eligible for checklist',
            );
        }

        const existingChecklist = await tx.appealChecklist.findUnique({
            where: { appealId },
        });

        if (existingChecklist)
            throw new BadRequestError('Checklist already exists');

        const { appealNumber, ...checklistData } = formData;

        await tx.appeal.update({
            where: { id: appealId },
            data: {
                appealNumber,
            },
        });

        const checklistDataWithNulls = Object.fromEntries(
            Object.entries(checklistData).map(([key, value]) => [
                key,
                value === undefined ? null : value,
            ]),
        );

        const checklist = await tx.appealChecklist.create({
            data: {
                ...checklistDataWithNulls,
                appealId,
            },
        });

        return checklist;
    });
};

export const sendAppealToHearingService = async (
    appealId: number,
    formData: SendToHearingInput,
    userId: number,
) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId, status: AppealStatus.WITH_REGISTRAR },
        include: {
            appealChecklist: true,
        },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found or not eligible for hearing');
    }

    if (!appeal.appealChecklist) {
        throw new BadRequestError('Checklist required before hearing');
    }

    validateTransition(appeal.status, AppealStatus.UNDER_HEARING);

    const { hearingDate, registrarComments } = formData;

    const result = await prismaClient.$transaction(async (tx) => {
        const updatedAppeal = await tx.appeal.update({
            where: { id: appealId },
            data: {
                registrarComments,
                status: AppealStatus.UNDER_HEARING,
            },
        });

        const hearing = await tx.hearing.create({
            data: {
                hearingNumber: 1,
                hearingDate,
                appealId,
            },
        });

        await createAuditLogService(tx, {
            appealId,
            userId,
            action: AuditAction.HEARING_SCHEDULED,
            details: {
                hearingId: hearing.id,
                hearingNumber: hearing.hearingNumber,
                hearingDate: hearing.hearingDate.toISOString(),
            },
        });

        return {
            updatedAppeal,
            hearing,
        };
    });

    return result;
};

export const completeHearingService = async (
    appealId: number,
    hearingId: number,
    userId: number,
) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId, status: AppealStatus.UNDER_HEARING },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found!');
    }

    const hearing = await prismaClient.hearing.findFirst({
        where: {
            id: hearingId,
            appealId,
            status: HearingStatus.SCHEDULED,
        },
    });

    if (!hearing) {
        throw new NotFoundError('Scheduled hearing not found!');
    }

    const result = await prismaClient.$transaction(async (tx) => {
        const updatedHearing = await tx.hearing.update({
            where: { id: hearingId },
            data: {
                status: HearingStatus.COMPLETED,
            },
        });

        await createAuditLogService(tx, {
            appealId,
            userId,
            action: AuditAction.HEARING_COMPLETED,
            details: {
                hearingId: updatedHearing.id,
                hearingNumber: updatedHearing.hearingNumber,
            },
        });

        return updatedHearing;
    });

    return result;
};

export const scheduleNextHearingService = async (
    appealId: number,
    hearingDate: Date,
    userId: number,
) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: {
            id: appealId,
            status: AppealStatus.UNDER_HEARING,
        },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found or not under hearing!');
    }

    const lastHearing = await prismaClient.hearing.findFirst({
        where: {
            appealId,
        },
        orderBy: {
            hearingNumber: 'desc',
        },
    });

    if (lastHearing?.status !== HearingStatus.COMPLETED) {
        throw new BadRequestError(
            'Current hearing must be completed before scheduling the next hearing',
        );
    }

    const nextHearingNumber = (lastHearing?.hearingNumber ?? 0) + 1;

    return await prismaClient.$transaction(async (tx) => {
        const hearing = await tx.hearing.create({
            data: {
                appealId,
                hearingNumber: nextHearingNumber,
                hearingDate,
            },
        });

        await createAuditLogService(tx, {
            appealId,
            userId,
            action: AuditAction.HEARING_SCHEDULED,
            details: {
                hearingId: hearing.id,
                hearingNumber: hearing.hearingNumber,
                hearingDate: hearing.hearingDate.toISOString(),
            },
        });

        return hearing;
    });
};

export const getAppealsUnderHearingService = async () => {
    const appeals = await prismaClient.appeal.findMany({
        where: {
            status: AppealStatus.UNDER_HEARING,
        },
        include: {
            hearings: {
                orderBy: {
                    hearingNumber: 'desc',
                },
                take: 1,
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });

    return appeals;
};

export const getAppealUnderHearingService = async (appealId: number) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: {
            id: appealId,
            status: AppealStatus.UNDER_HEARING,
        },
        include: {
            hearings: {
                orderBy: {
                    hearingNumber: 'asc',
                },
            },
        },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found or not under hearing!');
    }

    return appeal;
};

export const disposeAppealService = async (
    appealId: number,
    comment: string,
    userId: number,
) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId, status: AppealStatus.UNDER_HEARING },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found or not under hearing!');
    }

    const lastHearing = await prismaClient.hearing.findFirst({
        where: { appealId },
        orderBy: { hearingNumber: 'desc' },
    });

    if (lastHearing?.status !== HearingStatus.COMPLETED) {
        throw new BadRequestError(
            'Current hearing must be completed before disposing the appeal',
        );
    }

    validateTransition(appeal.status, AppealStatus.DISPOSED);

    return await prismaClient.$transaction(async (tx) => {
        const updatedAppeal = await tx.appeal.update({
            where: { id: appealId },
            data: {
                status: AppealStatus.DISPOSED,
                finalDecisionComment: comment,
            },
        });

        await createAuditLogService(tx, {
            appealId,
            userId,
            action: AuditAction.APPEAL_DISPOSED,
            details: {
                comment,
                status: AppealStatus.DISPOSED,
            },
        });

        return updatedAppeal;
    });
};

export const rejectAppealService = async (
    appealId: number,
    reason: string,
    userId: number,
) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: { id: appealId },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found!');
    }

    validateTransition(appeal.status, AppealStatus.REJECTED);

    return await prismaClient.$transaction(async (tx) => {
        const updatedAppeal = await tx.appeal.update({
            where: { id: appealId },
            data: {
                status: AppealStatus.REJECTED,
                finalDecisionComment: reason,
            },
        });

        await createAuditLogService(tx, {
            appealId,
            userId,
            action: AuditAction.APPEAL_REJECTED,
            details: {
                reason,
                status: AppealStatus.REJECTED,
            },
        });

        return updatedAppeal;
    });
};

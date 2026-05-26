import type { AppealStatus } from '@prisma/client';
import { ALLOWED_TRANSITIONS } from '../constants/workflow.js';
import { BadRequestError } from '../errors/customErrors.js';

export const validateTransition = (
    currentStatus: AppealStatus,
    nextStatus: AppealStatus,
) => {
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(nextStatus)) {
        throw new BadRequestError(
            `Cannot transition from ${currentStatus} to ${nextStatus}`,
        );
    }
};

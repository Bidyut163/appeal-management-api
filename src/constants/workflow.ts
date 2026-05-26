import { AppealStatus } from '@prisma/client';

export const ALLOWED_TRANSITIONS: Record<AppealStatus, AppealStatus[]> = {
    [AppealStatus.DRAFT]: [AppealStatus.UNDER_VERIFICATION],

    [AppealStatus.UNDER_VERIFICATION]: [AppealStatus.WITH_REGISTRAR],

    [AppealStatus.WITH_REGISTRAR]: [
        AppealStatus.REVERTED_TO_APPELLANT,
        AppealStatus.UNDER_HEARING,
    ],

    [AppealStatus.REVERTED_TO_APPELLANT]: [AppealStatus.UNDER_VERIFICATION],

    [AppealStatus.UNDER_HEARING]: [AppealStatus.CLOSED, AppealStatus.REJECTED],

    [AppealStatus.CLOSED]: [],

    [AppealStatus.REJECTED]: [],
};

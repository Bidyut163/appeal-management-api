import { AppealStatus } from '@prisma/client';

export const ALLOWED_TRANSITIONS: Record<AppealStatus, AppealStatus[]> = {
    [AppealStatus.DRAFT]: [
        AppealStatus.UNDER_VERIFICATION,
        AppealStatus.REJECTED,
    ],

    [AppealStatus.UNDER_VERIFICATION]: [
        AppealStatus.WITH_REGISTRAR,
        AppealStatus.REJECTED,
    ],

    [AppealStatus.WITH_REGISTRAR]: [
        AppealStatus.REVERTED_TO_APPELLANT,
        AppealStatus.UNDER_HEARING,
        AppealStatus.REJECTED,
    ],

    [AppealStatus.REVERTED_TO_APPELLANT]: [AppealStatus.UNDER_VERIFICATION],

    [AppealStatus.UNDER_HEARING]: [
        AppealStatus.DISPOSED,
        AppealStatus.REJECTED,
    ],

    [AppealStatus.DISPOSED]: [],

    [AppealStatus.REJECTED]: [],
};

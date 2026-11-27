import {
    PrismaClient,
    RoleType,
    AppealStatus,
    AuditAction,
    HearingStatus,
    RevertStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

type DemoAppeals = {
    verification: { id: number };
    registrar: { id: number };
    reverted: { id: number };
    hearing: { id: number };
    disposed: { id: number };
    draft: { id: number };
};

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'password123';

const now = new Date();

const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const daysAhead = (days: number) =>
    new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

async function seedRoles() {
    await prisma.role.createMany({
        data: [
            { name: RoleType.ADMIN },
            { name: RoleType.REGISTRAR },
            { name: RoleType.VERIFIER },
            { name: RoleType.APPELLANT },
        ],
        skipDuplicates: true,
    });

    const roles = await prisma.role.findMany();

    return Object.fromEntries(roles.map((role) => [role.name, role])) as Record<
        RoleType,
        (typeof roles)[number]
    >;
}

async function seedDemoUsers(roles: Record<RoleType, { id: number }>) {
    const password = await bcrypt.hash(DEMO_PASSWORD, 10);

    const users = {
        admin: await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {
                name: 'Demo Administrator',
                password,
                roles: {
                    set: [{ id: roles[RoleType.ADMIN].id }],
                },
            },
            create: {
                name: 'Demo Administrator',
                email: 'admin@example.com',
                password,
                roles: {
                    connect: [{ id: roles[RoleType.ADMIN].id }],
                },
            },
        }),

        registrar: await prisma.user.upsert({
            where: { email: 'registrar@example.com' },
            update: {
                name: 'Demo Registrar',
                password,
                roles: {
                    set: [{ id: roles[RoleType.REGISTRAR].id }],
                },
            },
            create: {
                name: 'Demo Registrar',
                email: 'registrar@example.com',
                password,
                roles: {
                    connect: [{ id: roles[RoleType.REGISTRAR].id }],
                },
            },
        }),

        verifier: await prisma.user.upsert({
            where: { email: 'verifier@example.com' },
            update: {
                name: 'Demo Verifier',
                password,
                roles: {
                    set: [{ id: roles[RoleType.VERIFIER].id }],
                },
            },
            create: {
                name: 'Demo Verifier',
                email: 'verifier@example.com',
                password,
                roles: {
                    connect: [{ id: roles[RoleType.VERIFIER].id }],
                },
            },
        }),

        appellant: await prisma.user.upsert({
            where: { email: 'appellant@example.com' },
            update: {
                name: 'Aarav Sharma',
                password,
                roles: {
                    set: [{ id: roles[RoleType.APPELLANT].id }],
                },
            },
            create: {
                name: 'Aarav Sharma',
                email: 'appellant@example.com',
                password,
                roles: {
                    connect: [{ id: roles[RoleType.APPELLANT].id }],
                },
            },
        }),
    };

    return users;
}

async function resetDemoAppeals(appellantId: number) {
    // Remove related records first because some relations do not
    // have cascading deletes configured in the Prisma schema.

    const existingAppeals = await prisma.appeal.findMany({
        where: { appellantId },
        select: { id: true },
    });

    const appealIds = existingAppeals.map((appeal) => appeal.id);

    if (appealIds.length === 0) return;

    await prisma.$transaction([
        prisma.appealRevert.deleteMany({
            where: { appealId: { in: appealIds } },
        }),
        prisma.hearing.deleteMany({
            where: { appealId: { in: appealIds } },
        }),
        prisma.appealDocument.deleteMany({
            where: { appealId: { in: appealIds } },
        }),
        prisma.payment.deleteMany({
            where: { appealId: { in: appealIds } },
        }),
        prisma.appealChecklist.deleteMany({
            where: { appealId: { in: appealIds } },
        }),
        prisma.auditLog.deleteMany({
            where: { appealId: { in: appealIds } },
        }),
        prisma.appeal.deleteMany({
            where: { id: { in: appealIds } },
        }),
    ]);
}

function makeAppealData(
    appellantId: number,
    appealNumber: string,
    projectRegistrationNumber: string,
    status: AppealStatus,
    createdAt: Date,
    respondentName: string,
    factsOfCase: string,
) {
    return {
        appealNumber,
        appellantName: 'Aarav Sharma',

        appellantResidentialAddressLine1: 'House No. 12, Green Valley',
        appellantResidentialAddressLine2: 'Six Mile',
        appellantResidentialLandmark: 'Near Community Centre',
        appellantResidentialCity: 'Guwahati',
        appellantResidentialDistrict: 'Kamrup Metropolitan',
        appellantResidentialState: 'Assam',
        appellantResidentialCountry: 'India',
        appellantResidentialPinCode: '781022',

        appellantServiceAddressLine1: 'House No. 12, Green Valley',
        appellantServiceAddressLine2: 'Six Mile',
        appellantServiceLandmark: 'Near Community Centre',
        appellantServiceCity: 'Guwahati',
        appellantServiceDistrict: 'Kamrup Metropolitan',
        appellantServiceState: 'Assam',
        appellantServiceCountry: 'India',
        appellantServicePinCode: '781022',

        appellantMobileNumber: '+919000000001',
        appellantEmailAddress: 'appellant@example.com',

        respondentName,

        respondentOfficeAddressLine1: 'Administrative Complex',
        respondentOfficeAddressLine2: 'GS Road',
        respondentOfficeLandmark: 'Near City Centre',
        respondentOfficeCity: 'Guwahati',
        respondentOfficeDistrict: 'Kamrup Metropolitan',
        respondentOfficeState: 'Assam',
        respondentOfficeCountry: 'India',
        respondentOfficePinCode: '781005',

        respondentServiceAddressLine1: 'Administrative Complex',
        respondentServiceAddressLine2: 'GS Road',
        respondentServiceLandmark: 'Near City Centre',
        respondentServiceCity: 'Guwahati',
        respondentServiceDistrict: 'Kamrup Metropolitan',
        respondentServiceState: 'Assam',
        respondentServiceCountry: 'India',
        respondentServicePinCode: '781005',

        respondentMobileNumber: '+919000000002',
        respondentEmailAddress: 'respondent@example.com',

        projectRegistrationNumber,

        isFiledWithinLimitation: true,
        delayReason: null,

        factsOfCase,
        groundsOfAppeal:
            'The appellant submits that the respondent has failed to fulfil the obligations agreed upon in the registered project documents.',
        reliefSought:
            'The appellant requests appropriate directions for compliance with the applicable provisions and protection of the appellant interests.',
        interimReliefRequested:
            'The appellant requests that the respondent be directed to preserve the relevant project records until disposal of this appeal.',
        isMatterPendingInCourt: false,

        status,
        createdAt,
        appellantId,
    };
}

async function seedDemoAppeals(appellantId: number): Promise<DemoAppeals> {
    const appeals = [
        {
            key: 'verification',
            data: makeAppealData(
                appellantId,
                'REAT/2026/001',
                'RERA/AS/2024/001',
                AppealStatus.UNDER_VERIFICATION,
                daysAgo(5),
                'North East Housing Developers',
                'The appellant booked a residential unit in the registered project. The respondent has not provided the agreed project updates and supporting documents.',
            ),
        },
        {
            key: 'registrar',
            data: makeAppealData(
                appellantId,
                'REAT/2026/002',
                'RERA/AS/2024/002',
                AppealStatus.WITH_REGISTRAR,
                daysAgo(12),
                'Brahmaputra Realty Private Limited',
                'The appellant entered into an agreement for a residential unit. The respondent has not completed the agreed obligations within the stipulated period.',
            ),
        },
        {
            key: 'reverted',
            data: makeAppealData(
                appellantId,
                'REAT/2026/003',
                'RERA/AS/2024/003',
                AppealStatus.REVERTED_TO_APPELLANT,
                daysAgo(18),
                'Green Horizon Developers',
                'The appellant has raised concerns regarding delays in the project and seeks directions for the respondent to comply with the registered project commitments.',
            ),
        },
        {
            key: 'hearing',
            data: makeAppealData(
                appellantId,
                'REAT/2026/004',
                'RERA/AS/2024/004',
                AppealStatus.UNDER_HEARING,
                daysAgo(25),
                'Eastern Valley Infrastructure',
                'The appellant has submitted an appeal concerning delayed delivery of the residential unit and requests appropriate relief under the applicable regulations.',
            ),
        },
        {
            key: 'disposed',
            data: makeAppealData(
                appellantId,
                'REAT/2026/005',
                'RERA/AS/2024/005',
                AppealStatus.DISPOSED,
                daysAgo(40),
                'Assam Urban Developers',
                'The appellant filed an appeal regarding non-compliance with the project agreement. The matter was heard and a final decision was recorded.',
            ),
        },
        {
            key: 'draft',
            data: makeAppealData(
                appellantId,
                'REAT/2026/006',
                'RERA/AS/2024/006',
                AppealStatus.DRAFT,
                daysAgo(1),
                'Riverfront Properties',
                'The appellant is preparing an appeal regarding the respondent obligations under the project agreement.',
            ),
        },
    ];

    const result: DemoAppeals = {
        verification: { id: 0 },
        registrar: { id: 0 },
        reverted: { id: 0 },
        hearing: { id: 0 },
        disposed: { id: 0 },
        draft: { id: 0 },
    };

    for (const appeal of appeals) {
        result[appeal.key as keyof DemoAppeals] = await prisma.appeal.create({
            data: appeal.data,
        });
    }

    return result;
}

async function seedChecklists(appeals: DemoAppeals) {
    for (const [key, appeal] of Object.entries(appeals)) {
        await prisma.appealChecklist.create({
            data: {
                appealId: appeal.id,
                complaintNumber: `23130${Object.keys(appeals).indexOf(key) + 1}`,
                legalProvision: 'Section 44',

                isAppealCompetent: true,
                arePartiesAndAddressesProper: true,
                isCertifiedCopyFiled: true,

                orderDate: daysAgo(90),
                communicationDate: daysAgo(85),
                certifiedCopyApplicationDate: daysAgo(80),
                certifiedCopyReadyDate: daysAgo(78),
                certifiedCopyReceiptDate: daysAgo(76),

                onlineFilingDate: daysAgo(20),
                hardCopySubmissionDate: daysAgo(18),

                isHardCopySubmissionDelayed: false,
                hardCopyDelayDays: 0,

                isAppealWithinLimitation: true,
                isAppealFilingDelayed: false,
                appealFilingDelayDays: 0,

                isCondonationApplicationFiled: false,
                objectionForCondonationDelay: null,

                areFeesPaid: true,
                paymentDate: daysAgo(19),

                areDocumentsFiledWithIndexPagination: true,
                areDocumentsLegible: true,

                isAppealMemoAnnexedForOtherSide: true,
                isAppealMemoServedByPostCourier: true,

                isVakalatnamaAuthorizationProper: true,
                isContactOnRecord: true,
            },
        });
    }
}

async function seedHearings(appeals: DemoAppeals) {
    await prisma.hearing.createMany({
        data: [
            {
                appealId: appeals.hearing.id,
                hearingNumber: 1,
                hearingDate: daysAhead(7),
                status: HearingStatus.SCHEDULED,
            },
            {
                appealId: appeals.disposed.id,
                hearingNumber: 1,
                hearingDate: daysAgo(12),
                status: HearingStatus.COMPLETED,
            },
        ],
    });
}

async function seedReverts(appeals: DemoAppeals, registrarId: number) {
    await prisma.appealRevert.create({
        data: {
            appealId: appeals.reverted.id,
            reason: 'Please provide the missing supporting documents and clarify the grounds of appeal before the matter can be processed further.',
            fields: ['factsOfCase', 'groundsOfAppeal'],
            status: RevertStatus.OPEN,
            createdById: registrarId,
            createdAt: daysAgo(3),
        },
    });
}

async function seedAuditLogs(
    appeals: DemoAppeals,
    users: {
        appellant: { id: number };
        verifier: { id: number };
        registrar: { id: number };
    },
) {
    const events = [
        {
            appealId: appeals.verification.id,
            userId: users.appellant.id,
            action: AuditAction.APPEAL_SUBMITTED,
            details: { message: 'Appeal submitted successfully.' },
            createdAt: daysAgo(5),
        },

        {
            appealId: appeals.registrar.id,
            userId: users.appellant.id,
            action: AuditAction.APPEAL_SUBMITTED,
            details: { message: 'Appeal submitted successfully.' },
            createdAt: daysAgo(12),
        },
        {
            appealId: appeals.registrar.id,
            userId: users.verifier.id,
            action: AuditAction.APPEAL_VERIFIED,
            details: {
                message: 'Appeal verified and forwarded to the Registrar.',
            },
            createdAt: daysAgo(9),
        },

        {
            appealId: appeals.reverted.id,
            userId: users.appellant.id,
            action: AuditAction.APPEAL_SUBMITTED,
            details: { message: 'Appeal submitted successfully.' },
            createdAt: daysAgo(18),
        },
        {
            appealId: appeals.reverted.id,
            userId: users.verifier.id,
            action: AuditAction.APPEAL_VERIFIED,
            details: {
                message: 'Appeal verified and forwarded to the Registrar.',
            },
            createdAt: daysAgo(15),
        },
        {
            appealId: appeals.reverted.id,
            userId: users.registrar.id,
            action: AuditAction.APPEAL_REVERTED,
            details: {
                message: 'Appeal reverted for supporting document corrections.',
            },
            createdAt: daysAgo(3),
        },

        {
            appealId: appeals.hearing.id,
            userId: users.appellant.id,
            action: AuditAction.APPEAL_SUBMITTED,
            details: { message: 'Appeal submitted successfully.' },
            createdAt: daysAgo(25),
        },
        {
            appealId: appeals.hearing.id,
            userId: users.verifier.id,
            action: AuditAction.APPEAL_VERIFIED,
            details: {
                message: 'Appeal verified and forwarded to the Registrar.',
            },
            createdAt: daysAgo(22),
        },
        {
            appealId: appeals.hearing.id,
            userId: users.registrar.id,
            action: AuditAction.HEARING_SCHEDULED,
            details: {
                hearingNumber: 1,
                hearingDate: daysAhead(7).toISOString(),
            },
            createdAt: daysAgo(2),
        },

        {
            appealId: appeals.disposed.id,
            userId: users.appellant.id,
            action: AuditAction.APPEAL_SUBMITTED,
            details: { message: 'Appeal submitted successfully.' },
            createdAt: daysAgo(40),
        },
        {
            appealId: appeals.disposed.id,
            userId: users.verifier.id,
            action: AuditAction.APPEAL_VERIFIED,
            details: {
                message: 'Appeal verified and forwarded to the Registrar.',
            },
            createdAt: daysAgo(37),
        },
        {
            appealId: appeals.disposed.id,
            userId: users.registrar.id,
            action: AuditAction.HEARING_SCHEDULED,
            details: {
                hearingNumber: 1,
                hearingDate: daysAgo(12).toISOString(),
            },
            createdAt: daysAgo(20),
        },
        {
            appealId: appeals.disposed.id,
            userId: users.registrar.id,
            action: AuditAction.HEARING_COMPLETED,
            details: { message: 'Hearing completed.' },
            createdAt: daysAgo(12),
        },
        {
            appealId: appeals.disposed.id,
            userId: users.registrar.id,
            action: AuditAction.APPEAL_DISPOSED,
            details: {
                comment:
                    'The appeal has been disposed of following completion of the hearing and consideration of the submitted records.',
            },
            createdAt: daysAgo(10),
        },

        {
            appealId: appeals.draft.id,
            userId: users.appellant.id,
            action: AuditAction.APPEAL_CREATED,
            details: { message: 'Appeal draft created.' },
            createdAt: daysAgo(1),
        },
    ];

    await prisma.auditLog.createMany({
        data: events,
    });
}

async function main() {
    console.log('Seeding demo roles...');
    const roles = await seedRoles();

    console.log('Seeding demo users...');
    const users = await seedDemoUsers(roles);

    console.log('Resetting previous demo appeals...');
    await resetDemoAppeals(users.appellant.id);

    console.log('Creating demo appeals...');
    const appeals = await seedDemoAppeals(users.appellant.id);

    console.log('Creating demo checklists...');
    await seedChecklists(appeals);

    console.log('Creating demo hearings...');
    await seedHearings(appeals);

    console.log('Creating demo reversion...');
    await seedReverts(appeals, users.registrar.id);

    console.log('Creating demo audit history...');
    await seedAuditLogs(appeals, users);

    console.log('Demo seed completed successfully.');
    console.log('Demo password:', DEMO_PASSWORD);
}

main()
    .catch((error) => {
        console.error('Demo seed failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

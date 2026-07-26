import { PrismaClient, RoleType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // -----------------------------
    // Create roles
    // -----------------------------
    await prisma.role.createMany({
        data: [
            { name: RoleType.ADMIN },
            { name: RoleType.REGISTRAR },
            { name: RoleType.VERIFIER },
            { name: RoleType.APPELLANT },
        ],
        skipDuplicates: true,
    });

    // -----------------------------
    // Fetch roles
    // -----------------------------
    const adminRole = await prisma.role.findUnique({
        where: { name: RoleType.ADMIN },
    });

    const registrarRole = await prisma.role.findUnique({
        where: { name: RoleType.REGISTRAR },
    });

    const verifierRole = await prisma.role.findUnique({
        where: { name: RoleType.VERIFIER },
    });

    const appellantRole = await prisma.role.findUnique({
        where: { name: RoleType.APPELLANT },
    });

    // -----------------------------
    // Create users
    // -----------------------------
    const password = await bcrypt.hash('password123', 10);

    // Admin
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@example.com',
            password,
            roles: {
                connect: [{ id: adminRole!.id }],
            },
        },
    });

    // Registrar
    await prisma.user.upsert({
        where: { email: 'registrar@example.com' },
        update: {},
        create: {
            name: 'Registrar User',
            email: 'registrar@example.com',
            password,
            roles: {
                connect: [{ id: registrarRole!.id }],
            },
        },
    });

    // Verifier
    await prisma.user.upsert({
        where: { email: 'verifier@example.com' },
        update: {},
        create: {
            name: 'Verifier User',
            email: 'verifier@example.com',
            password,
            roles: {
                connect: [{ id: verifierRole!.id }],
            },
        },
    });

    // Appellant
    const appellant = await prisma.user.upsert({
        where: { email: 'appellant@example.com' },
        update: {},
        create: {
            name: 'Appellant User',
            email: 'appellant@example.com',
            password,
            roles: {
                connect: [{ id: appellantRole!.id }],
            },
        },
    });

    // -----------------------------
    // Create appeal
    // -----------------------------
    const appeal = await prisma.appeal.upsert({
        where: { id: 1 },
        update: {},
        create: {
            appellantName: 'Padum Deuri',
            appellantResidentialAddressLine1:
                'B/35, Gool Mahal, Sleater Road, Grant Road',
            appellantResidentialAddressLine2: 'Mumbai, Maharashtra, 400007',
            appellantResidentialLandmark: 'Juhu Beach',
            appellantResidentialCity: 'Mumbai',
            appellantResidentialDistrict: 'Mumbai',
            appellantResidentialState: 'Maharashtra',
            appellantResidentialCountry: 'India',
            appellantResidentialPinCode: '400007',

            appellantServiceAddressLine1:
                'B/35, Gool Mahal, Sleater Road, Grant Road',
            appellantServiceAddressLine2: 'Mumbai, Maharashtra, 400007',
            appellantServiceLandmark: 'Juhu Beach',
            appellantServiceCity: 'Mumbai',
            appellantServiceDistrict: 'Mumbai',
            appellantServiceState: 'Maharashtra',
            appellantServiceCountry: 'India',
            appellantServicePinCode: '400007',

            appellantMobileNumber: '+919864263985',
            appellantEmailAddress: 'pdeuri@gmail.com',

            respondentName: 'RERA Assam',
            respondentOfficeAddressLine1:
                'B/35, Gool Mahal, Sleater Road, Grant Road',
            respondentOfficeAddressLine2: 'Mumbai, Maharashtra, 400007',
            respondentOfficeLandmark: 'Juhu Beach',
            respondentOfficeCity: 'Mumbai',
            respondentOfficeDistrict: 'Mumbai',
            respondentOfficeState: 'Maharashtra',
            respondentOfficeCountry: 'India',
            respondentOfficePinCode: '400007',

            respondentServiceAddressLine1:
                'B/35, Gool Mahal, Sleater Road, Grant Road',
            respondentServiceAddressLine2: 'Mumbai, Maharashtra, 400007',
            respondentServiceLandmark: 'Juhu Beach',
            respondentServiceCity: 'Mumbai',
            respondentServiceDistrict: 'Mumbai',
            respondentServiceState: 'Maharashtra',
            respondentServiceCountry: 'India',
            respondentServicePinCode: '400007',

            respondentMobileNumber: '+919876543210',
            respondentEmailAddress: 'reraassam@gmail.com',

            projectRegistrationNumber: 'RERA/253/2026',
            isFiledWithinLimitation: true,
            delayReason:
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            factsOfCase:
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            groundsOfAppeal:
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            reliefSought:
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            interimReliefRequested:
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            isMatterPendingInCourt: false,

            status: 'UNDER_VERIFICATION',
            appellantId: appellant.id,
        },
    });

    // -----------------------------
    // Create appeal checklist
    // -----------------------------

    await prisma.appealChecklist.upsert({
        where: { appealId: appeal.id },
        update: {},
        create: {
            appealId: appeal.id,
            complaintNumber: '231302',
            sectionNumber: '44',
        },
    });

    console.log('Seed completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

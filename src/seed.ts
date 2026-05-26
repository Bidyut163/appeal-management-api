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
    await prisma.user.upsert({
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

import { RoleType } from '@prisma/client';
import { prismaClient } from '../server.js';
import { BadRequestError } from '../errors/customErrors.js';
import { hashPassword } from '../utils/passwordUtils.js';
import type { CreateOfficialInput } from '../validators/adminSchemas.js';

export const getOfficialsService = async () => {
    const users = await prismaClient.user.findMany({
        where: {
            roles: {
                some: {
                    name: {
                        in: [RoleType.REGISTRAR, RoleType.VERIFIER],
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            roles: {
                select: {
                    name: true,
                },
            },
        },
    });

    return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map((role) => role.name),
    }));
};

export const createOfficialService = async (
    officialData: CreateOfficialInput,
) => {
    const { email, password, name, role } = officialData;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prismaClient.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existingUser) throw new BadRequestError('User already exists');

    const hashedPassword = await hashPassword(password);

    const user = await prismaClient.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            roles: {
                connect: {
                    name: role,
                },
            },
        },
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
    };
};

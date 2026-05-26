import { RoleType } from '@prisma/client';
import {
    BadRequestError,
    InternalServerError,
    UnauthenticatedError,
} from '../errors/customErrors.js';
import { prismaClient } from '../server.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { createJWT } from '../utils/tokenUtils.js';

import * as z from 'zod';
import { signupSchema } from '../validators/authSchemas.js';

type SignupInput = z.infer<typeof signupSchema>;

export const loginService = async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase();
    const user = await prismaClient.user.findUnique({
        where: { email: normalizedEmail },
        include: {
            roles: true,
        },
    });

    const isValidUser =
        user && (await comparePassword(password, user.password));

    if (!isValidUser) throw new UnauthenticatedError('Invalid credentials');

    const token = createJWT({
        userId: user.id,
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles.map((role) => role.name),
        },
    };
};

export const signupService = async (formData: SignupInput) => {
    const { email, password, name } = formData;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prismaClient.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existingUser) throw new BadRequestError('User already exists');

    const role = await prismaClient.role.findUnique({
        where: { name: RoleType.APPELLANT },
    });

    if (!role) throw new InternalServerError('Appellant role not configured');

    const hashedPassword = await hashPassword(password);

    const user = await prismaClient.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            roles: {
                connect: {
                    id: role.id,
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

export const getCurrentUserService = async (userId: number) => {
    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        include: {
            roles: true,
        },
    });

    if (!user) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map((role) => role.name),
    };
};

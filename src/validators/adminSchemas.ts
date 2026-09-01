import { RoleType } from '@prisma/client';
import z from 'zod';

export const createOfficialSchema = z
    .object({
        name: z.string().trim().min(1, 'Name is required'),
        email: z.email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        role: z.enum([RoleType.REGISTRAR, RoleType.VERIFIER]),
    })
    .strict();

export type CreateOfficialInput = z.infer<typeof createOfficialSchema>;

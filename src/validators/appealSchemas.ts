import * as z from 'zod';

export const createAppealSchema = z
    .object({
        description: z.string().trim().min(1, 'Description is required'),
    })
    .strict();

export const appealIdParamSchema = z.object({
    // id: z
    //     .string()
    //     .regex(/^\d+$/, 'Invalid appeal id')
    //     .transform((val) => Number(val)),

    // id: z.coerce.number().int().positive(),
    id: z.coerce
        .number({
            error: 'Appeal id must be a number',
        })
        .int('Appeal id must be an integer')
        .positive('Appeal id must be positive'),
});

export const verifyAppealSchema = z
    .object({
        verifierComment: z
            .string()
            .trim()
            .min(1, 'Verifier comment is required'),
    })
    .strict();

export const revertAppealSchema = z
    .object({
        registrarComment: z
            .string()
            .trim()
            .min(1, 'Registrar comment is required'),
    })
    .strict();

export const createAppealChecklistSchema = z.object({
    complaintNumber: z.string(),
    sectionNumber: z.string(),
});

export const sendToHearingSchema = z
    .object({
        hearingDate: z.coerce.date(),
        registrarComments: z
            .string()
            .trim()
            .min(1, 'Registrar comment required'),
    })
    .strict();

import * as z from 'zod';

const nullableOptionalString = z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? null);

const booleanField = z.preprocess((value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;

    return value;
}, z.boolean());

export const createAppealSchema = z
    .object({
        // -------------Appellant------------
        appellantName: z.string().trim().min(1, 'Appellant name is required'),

        // residential address
        appellantResidentialAddressLine1: z
            .string()
            .trim()
            .min(1, 'Appellant residential address line 1 is required'),
        appellantResidentialAddressLine2: nullableOptionalString,
        appellantResidentialLandmark: nullableOptionalString,
        appellantResidentialCity: z
            .string()
            .trim()
            .min(1, 'Appellant residential address City is required'),
        appellantResidentialDistrict: z
            .string()
            .trim()
            .min(1, 'Appellant residential address District is required'),
        appellantResidentialState: z
            .string()
            .trim()
            .min(1, 'Appellant residential address State is required'),
        appellantResidentialCountry: z
            .string()
            .trim()
            .min(1, 'Appellant residential address Country is required'),
        appellantResidentialPinCode: z
            .string()
            .trim()
            .regex(/^\d{6}$/, 'Invalid PIN Code'),

        // service adddress
        appellantServiceAddressLine1: z
            .string()
            .trim()
            .min(1, 'Appellant service address line 1 is required'),
        appellantServiceAddressLine2: nullableOptionalString,
        appellantServiceLandmark: nullableOptionalString,
        appellantServiceCity: z
            .string()
            .trim()
            .min(1, 'Appellant service address City is required'),
        appellantServiceDistrict: z
            .string()
            .trim()
            .min(1, 'Appellant service address District is required'),
        appellantServiceState: z
            .string()
            .trim()
            .min(1, 'Appellant service address State is required'),
        appellantServiceCountry: z
            .string()
            .trim()
            .min(1, 'Appellant service address Country is required'),
        appellantServicePinCode: z
            .string()
            .trim()
            .regex(/^\d{6}$/, 'Invalid PIN Code'),

        appellantMobileNumber: z.e164({
            message:
                'Invalid mobile number format. Must be E.164 format (e.g., +919876543210).',
        }),

        appellantEmailAddress: z.email({
            message: 'Invalid email address format.',
        }),

        // ---------------Respondent-------------
        respondentName: z.string().trim().min(1, 'Respondent name is required'),

        // office address
        respondentOfficeAddressLine1: z
            .string()
            .trim()
            .min(1, 'Respondent office address line 1 is required'),
        respondentOfficeAddressLine2: nullableOptionalString,
        respondentOfficeLandmark: nullableOptionalString,
        respondentOfficeCity: z
            .string()
            .trim()
            .min(1, 'Respondent office address City is required'),
        respondentOfficeDistrict: z
            .string()
            .trim()
            .min(1, 'Respondent office address District is required'),
        respondentOfficeState: z
            .string()
            .trim()
            .min(1, 'Respondent office address State is required'),
        respondentOfficeCountry: z
            .string()
            .trim()
            .min(1, 'Respondent office address Country is required'),
        respondentOfficePinCode: z
            .string()
            .trim()
            .regex(/^\d{6}$/, 'Invalid PIN Code'),

        // service adddress
        respondentServiceAddressLine1: z
            .string()
            .trim()
            .min(1, 'Respondent service address line 1 is required'),
        respondentServiceAddressLine2: nullableOptionalString,
        respondentServiceLandmark: nullableOptionalString,
        respondentServiceCity: z
            .string()
            .trim()
            .min(1, 'Respondent service address City is required'),
        respondentServiceDistrict: z
            .string()
            .trim()
            .min(1, 'Respondent service address District is required'),
        respondentServiceState: z
            .string()
            .trim()
            .min(1, 'Respondent service address State is required'),
        respondentServiceCountry: z
            .string()
            .trim()
            .min(1, 'Respondent service address Country is required'),
        respondentServicePinCode: z
            .string()
            .trim()
            .regex(/^\d{6}$/, 'Invalid PIN Code'),

        respondentMobileNumber: z.e164({
            message:
                'Invalid mobile number format. Must be E.164 format (e.g., +919876543210).',
        }),

        respondentEmailAddress: z.email({
            message: 'Invalid email address format.',
        }),

        // -----------------Appeal Details---------------
        projectRegistrationNumber: nullableOptionalString,
        isFiledWithinLimitation: booleanField,
        delayReason: nullableOptionalString,
        factsOfCase: z.string().trim().min(1, 'Facts of case 1 is required'),
        groundsOfAppeal: z
            .string()
            .trim()
            .min(1, 'Grounds of appeal is required'),
        reliefSought: z.string().trim().min(1, 'Relief sought is required'),
        interimReliefRequested: nullableOptionalString,
        isMatterPendingInCourt: booleanField,
    })
    .superRefine((data, ctx) => {
        if (!data.isFiledWithinLimitation && !data.delayReason?.trim()) {
            ctx.addIssue({
                code: 'custom',
                path: ['delayReason'],
                message: 'Delay reason is required.',
            });
        }
    })
    .strict();

export type CreateAppealInput = z.infer<typeof createAppealSchema>;
// ===================CREATE APPEAL SCHEMA END========================

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

export const createAppealChecklistSchema = z
    .object({
        complaintNumber: z.string(),
        sectionNumber: z.string(),
    })
    .strict();

export const sendToHearingSchema = z
    .object({
        hearingDate: z.coerce.date(),
        registrarComments: z
            .string()
            .trim()
            .min(1, 'Registrar comment required'),
    })
    .strict();

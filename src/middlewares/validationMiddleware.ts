import * as z from 'zod';
import type { ZodType } from 'zod';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

type ValidationTarget = 'body' | 'params' | 'query';

export const validate = (
    schema: ZodType,
    target: ValidationTarget = 'body',
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);
        // console.log(result);

        if (!result.success) {
            const flattened = z.flattenError(result.error);
            console.log('====================');
            console.log(flattened);

            return res.status(400).json({
                message: 'Validation failed',
                errors: flattened.fieldErrors,
            });
        }

        req[target] = result.data; // sanitized + typed
        next();
    };
};

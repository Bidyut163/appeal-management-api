import { Router } from 'express';
// middlewares
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

// types
import { RoleType } from '@prisma/client';

//controllers
import {
    getUnderVerificationAppeal,
    getUnderVerificationAppeals,
    verifyAppeal,
} from '../controllers/verifierController.js';

// validators
import {
    appealIdParamSchema,
    verifyAppealSchema,
} from '../validators/appealSchemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router: Router = Router();

// ================================
// @@path: api/v1/verifier/appeals
// ================================

// @route GET api/v1/verifier/appeals/
// @desc Return a list of appeals with status = UNDER_VERFICATION
// @access Private/Only verifier

router.get(
    '/',
    authenticateUser,
    authorizeRoles(RoleType.VERIFIER),
    asyncHandler(getUnderVerificationAppeals),
);

// @route GET api/v1/verifier/appeals/:id
// @desc Return an appeal with status = UNDER_VERFICATION and id = ${id}
// @access Private/Only verifier

router.get(
    '/:id',
    validate(appealIdParamSchema, 'params'),
    authenticateUser,
    authorizeRoles(RoleType.VERIFIER),
    asyncHandler(getUnderVerificationAppeal),
);

// @route PATCH api/v1/verifier/appeals/:id/verify
// @desc Review an appeal and forward to registrar
// @access Private/Only verifier

router.patch(
    '/:id/verify',
    validate(appealIdParamSchema, 'params'),
    validate(verifyAppealSchema),
    authenticateUser,
    authorizeRoles(RoleType.VERIFIER),
    asyncHandler(verifyAppeal),
);

export default router;

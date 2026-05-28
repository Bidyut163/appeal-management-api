import { Router } from 'express';

// middlewares
import { validate } from '../middlewares/validationMiddleware.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeMiddleware.js';

// controllers
import {
    createAppealChecklist,
    getWithRegistrarAppeal,
    getWithRegistrarAppeals,
    revertAppeal,
    sendAppealToHearing,
} from '../controllers/registrarController.js';

// validators
import {
    appealIdParamSchema,
    createAppealChecklistSchema,
    revertAppealSchema,
} from '../validators/appealSchemas.js';

// types
import { RoleType } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const router: Router = Router();

// ================================
// @@path: api/v1/registrar/appeals
// ================================

// @route GET api/v1/registrar/appeals
// @desc Get all appeals with status = 'WITH_REGISTRAR'
// @access Private/Only registrar

router.get(
    '/',
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    asyncHandler(getWithRegistrarAppeals),
);

// @route GET api/v1/registrar/appeals/:id
// @desc Return an appeal with status = 'WITH_REGISTRAR' and id = ${id}
// @access Private/Only registrar

router.get(
    '/:id',
    validate(appealIdParamSchema, 'params'),
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    asyncHandler(getWithRegistrarAppeal),
);

// @route PATCH api/v1/registrar/appeals/:id/revert
// @desc Revert back an appeal to appellant
// @access Private/Only registrar

router.patch(
    '/:id/revert',
    validate(appealIdParamSchema, 'params'),
    validate(revertAppealSchema),
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    asyncHandler(revertAppeal),
);

// @route POST api/v1/registrar/appeals/:id/checklist
// @desc  Create the checklist for the appeal
// @access Private/Only registrar

router.post(
    '/:id/checklist',
    validate(appealIdParamSchema, 'params'),
    validate(createAppealChecklistSchema),
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    asyncHandler(createAppealChecklist),
);

// @route PATCH api/v1/registrar/appeals/:id/send-to-hearing
// @desc  Send the appeal to hearing phase
// @access Private/Only registrar

router.patch(
    '/:id/send-to-hearing',
    validate(appealIdParamSchema, 'params'),
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    asyncHandler(sendAppealToHearing),
);

export default router;

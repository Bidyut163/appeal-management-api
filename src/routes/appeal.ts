import { Router } from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import {
    createAppeal,
    getAllAppeals,
    getAppeal,
    resubmitAppeal,
} from '../controllers/appealController.js';
import { authorizeRoles } from '../middlewares/authorizeMiddleware.js';
import { RoleType } from '@prisma/client';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    createAppealSchema,
    appealIdParamSchema,
} from '../validators/appealSchemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadAppealDocument } from '../middlewares/uploadMiddleware.js';

const router: Router = Router();

// ================================
// @@path: api/v1/appeals
// ================================

// @route GET api/v1/appeals
// @desc Get all appeals of an appellant
// @access Private/Only appellant
router.get(
    '/',
    authenticateUser,
    authorizeRoles(RoleType.APPELLANT),
    asyncHandler(getAllAppeals),
);

// @route Post api/v1/appeals
// @desc  Create an  Appeal
// @access Private/Only appellant
router.post(
    '/',
    authenticateUser,
    authorizeRoles(RoleType.APPELLANT),
    uploadAppealDocument,
    validate(createAppealSchema),
    asyncHandler(createAppeal),
);

// @route GET api/v1/appeals/:id
// @desc Get a single appeal
// @access Private/Only appellant
router.get(
    '/:id',
    validate(appealIdParamSchema, 'params'),
    authenticateUser,
    authorizeRoles(RoleType.APPELLANT),
    asyncHandler(getAppeal),
);

// @route PATCH api/v1/appeals/:id/resubmit
// @desc Update an appeal and resubmit in case of appleal is reverted back
// @access Private/Only appellant

router.patch(
    '/:id/resubmit',
    validate(appealIdParamSchema, 'params'),
    validate(createAppealSchema),
    authenticateUser,
    authorizeRoles(RoleType.APPELLANT),
    asyncHandler(resubmitAppeal),
);

// Only admin
// router.post(
//     '/admin',
//     authenticateUser,
//     authorizeRoles(RoleType.ADMIN),
//     (req, res) => {
//         res.send('Create user (admin only)');
//     },
// );

export default router;

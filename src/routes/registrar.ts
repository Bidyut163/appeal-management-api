import { Router } from 'express';

// middlewares
import { validate } from '../middlewares/validationMiddleware.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeMiddleware.js';

// controllers
import {
    completeHearing,
    createAppealChecklist,
    disposeAppeal,
    getAppealsUnderHearing,
    getAppealUnderHearing,
    getWithRegistrarAppeal,
    getWithRegistrarAppeals,
    rejectAppeal,
    revertAppeal,
    scheduleNextHearing,
    sendAppealToHearing,
} from '../controllers/registrarController.js';

// validators
import {
    appealIdParamSchema,
    completeHearingParamSchema,
    createAppealChecklistSchema,
    disposeAppealSchema,
    rejectAppealSchema,
    revertAppealSchema,
    scheduleNextHearingSchema,
    sendToHearingSchema,
} from '../validators/appealSchemas.js';

// types
import { RoleType } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getAuditLogs } from '../controllers/auditLogController.js';

const router: Router = Router();

// ================================
// @@path: api/v1/registrar/appeals
// ================================

// @route GET api/v1/registrar/appeals/under-hearing
// @desc  Get all appeals under hearing
// @access Private/Only registrar

router.get(
    '/under-hearing',
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    asyncHandler(getAppealsUnderHearing),
);

// @route GET api/v1/registrar/appeals/under-hearing/:id
// @desc  Get appeal under hearing
// @access Private/Only registrar

router.get(
    '/under-hearing/:id',
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    validate(appealIdParamSchema, 'params'),
    asyncHandler(getAppealUnderHearing),
);

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
    validate(sendToHearingSchema),
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    asyncHandler(sendAppealToHearing),
);

// @route PATCH api/v1/registrar/appeals/:appealId/hearings/:hearingId/complete
// @desc  Mark hearing as complete
// @access Private/Only registrar

router.patch(
    '/:appealId/hearings/:hearingId/complete',
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    validate(completeHearingParamSchema, 'params'),
    asyncHandler(completeHearing),
);

// @route POST api/v1/registrar/appeals/:id/schedule-next-hearing
// @desc  Schedule next hearing
// @access Private/Only registrar

router.post(
    '/:id/schedule-next-hearing',
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    validate(appealIdParamSchema, 'params'),
    validate(scheduleNextHearingSchema),
    asyncHandler(scheduleNextHearing),
);

// @route PATCH api/v1/registrar/appeals/:id/dispose
// @desc  Dispose appeal
// @access Private/Only registrar

router.patch(
    '/:id/dispose',
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    validate(appealIdParamSchema, 'params'),
    validate(disposeAppealSchema),
    asyncHandler(disposeAppeal),
);

// @route PATCH api/v1/registrar/appeals/:id/reject
// @desc  Reject appeal
// @access Private/Only registrar

router.patch(
    '/:id/reject',
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    validate(appealIdParamSchema, 'params'),
    validate(rejectAppealSchema),
    asyncHandler(rejectAppeal),
);

// @route GET /api/v1/registrar/appeals/:id/audit-logs
// @desc  Get audit logs
// @access Private/Only registrar

router.get(
    '/:id/audit-logs',
    authenticateUser,
    authorizeRoles(RoleType.REGISTRAR),
    validate(appealIdParamSchema, 'params'),
    asyncHandler(getAuditLogs),
);

export default router;

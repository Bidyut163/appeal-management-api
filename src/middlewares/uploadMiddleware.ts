import multer from 'multer';
import type { FileFilterCallback } from 'multer';
import type { Request } from 'express';
import path from 'path';
import { BadRequestError } from '../errors/customErrors.js';

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/appeals');
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `appeal-${uniqueSuffix}${extension}`);
    },
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    if (file.mimetype === 'application/pdf') {
        return cb(null, true);
    }

    return cb(new BadRequestError('Only PDF files are allowed.'));
};

export const uploadAppealDocument = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
}).single('appealDocument');

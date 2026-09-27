import express from 'express';
import type { Express, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { FRONTEND_URL, PORT } from './secrets.js';
import cookieParser from 'cookie-parser';

// router
import rootRouter from './routes/index.js';
// middleware
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
// Prisma - DB
import { PrismaClient } from '@prisma/client';
import { createDirectories } from './utils/createDirectories.js';

const app: Express = express();

createDirectories();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.json());

export const prismaClient = new PrismaClient();
//     {
//     log: ['query'],
// });

// router
app.use('/api/v1', rootRouter);

app.use('/{*splat}', (req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' });
});

app.use(errorHandlerMiddleware);

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on port:', PORT);
});

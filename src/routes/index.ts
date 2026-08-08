import { Router } from 'express';
import authRouter from './auth.js';
import appealRouter from './appeal.js';
import verifierRouter from './verifier.js';
import registrarRouter from './registrar.js';
import paymentRouter from './payment.js';

const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/appeals', appealRouter);
rootRouter.use('/verifier/appeals', verifierRouter);
rootRouter.use('/registrar/appeals', registrarRouter);
rootRouter.use('/payments', paymentRouter);

export default rootRouter;

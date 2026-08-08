import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
    createOrderService,
    failedPaymentService,
    verifyPaymentService,
} from '../services/paymentService.js';

export const createOrder = async (req: Request, res: Response) => {
    const { appealId } = req.body;
    const userId = req.user!.userId;

    const order = await createOrderService(userId, appealId);

    return res.status(StatusCodes.OK).json(order);
};

export const verifyPayment = async (req: Request, res: Response) => {
    const { appealId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
        req.body;
    const userId = req.user!.userId;

    const payment = await verifyPaymentService(userId, {
        appealId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
    });

    return res.status(StatusCodes.OK).json(payment);
};

export const failedPayment = async (req: Request, res: Response) => {
    const {
        appealId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpayErrorCode,
        razorpayErrorDescription,
    } = req.body;

    const userId = req.user!.userId;

    const failedPayment = await failedPaymentService(userId, {
        appealId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpayErrorCode,
        razorpayErrorDescription,
    });

    return res.status(StatusCodes.OK).json(failedPayment);
};

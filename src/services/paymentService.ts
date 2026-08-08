import { AppealStatus, PaymentStatus } from '@prisma/client';
import { prismaClient } from '../server.js';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { razorpay } from '../lib/razorpay.js';
import { APPEAL_FILING_FEE } from '../constants/payment.js';

import { validateTransition } from '../utils/workflow.js';
import { verifyRazorpaySignature } from '../utils/payment.js';

export const createOrderService = async (userId: number, appealId: number) => {
    const appeal = await prismaClient.appeal.findFirst({
        where: {
            id: appealId,
            appellantId: userId,
            status: AppealStatus.DRAFT,
        },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    const existingPayment = await prismaClient.payment.findUnique({
        where: { appealId },
    });

    // Already paid
    if (existingPayment?.status === PaymentStatus.SUCCESS) {
        throw new BadRequestError('Payment has already been completed');
    }

    // Existing pending payment/order
    if (
        existingPayment?.status === PaymentStatus.PENDING &&
        existingPayment.razorpayOrderId
    ) {
        // throw new BadRequestError('A payment is already pending.');
        return {
            key: process.env.RAZORPAY_KEY_ID,
            orderId: existingPayment.razorpayOrderId,
            amount: existingPayment.amount,
            currency: 'INR',
        };
    }

    // Create a new Razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount: APPEAL_FILING_FEE * 100,
        currency: 'INR',
        receipt: `appeal_${appeal.id}`,
    });

    if (existingPayment?.status === PaymentStatus.FAILED) {
        await prismaClient.payment.update({
            where: { appealId },
            data: {
                amount: APPEAL_FILING_FEE * 100,
                status: PaymentStatus.PENDING,
                razorpayOrderId: razorpayOrder.id,
                razorpayPaymentId: null,
                razorpaySignature: null,
                failureCode: null,
                failureReason: null,
            },
        });
    } else {
        await prismaClient.payment.create({
            data: {
                amount: APPEAL_FILING_FEE * 100,
                status: PaymentStatus.PENDING,
                razorpayOrderId: razorpayOrder.id,
                appealId,
            },
        });
    }

    return {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
    };
};

type VerifyPaymentInput = {
    appealId: number;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
};

export const verifyPaymentService = async (
    userId: number,
    paymentData: VerifyPaymentInput,
) => {
    const { appealId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        paymentData;

    const appeal = await prismaClient.appeal.findFirst({
        where: {
            id: appealId,
            appellantId: userId,
            status: AppealStatus.DRAFT,
        },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    const existingPayment = await prismaClient.payment.findUnique({
        where: { appealId },
    });

    if (!existingPayment) {
        throw new NotFoundError('Payment not found.');
    }

    if (existingPayment.razorpayOrderId !== razorpayOrderId) {
        throw new BadRequestError('Invalid order id.');
    }

    if (existingPayment.status !== PaymentStatus.PENDING) {
        throw new BadRequestError('Payment already verified.');
    }

    const isValid = verifyRazorpaySignature(
        existingPayment.razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
    );

    if (!isValid) {
        throw new BadRequestError('Invalid payment signature.');
    }

    validateTransition(appeal.status, AppealStatus.UNDER_VERIFICATION);

    return prismaClient.$transaction(async (tx) => {
        await tx.payment.update({
            where: { appealId },
            data: {
                razorpayPaymentId,
                razorpaySignature,
                status: PaymentStatus.SUCCESS,
            },
        });

        await tx.appeal.update({
            where: { id: appealId },
            data: {
                status: AppealStatus.UNDER_VERIFICATION,
            },
        });

        return { message: 'Payment verified successfully.' };
    });
};

type FailedPaymentInput = {
    appealId: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpayErrorCode: string;
    razorpayErrorDescription: string;
};

export const failedPaymentService = async (
    userId: number,
    failedPaymentData: FailedPaymentInput,
) => {
    const {
        appealId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpayErrorCode,
        razorpayErrorDescription,
    } = failedPaymentData;

    const appeal = await prismaClient.appeal.findFirst({
        where: {
            id: appealId,
            appellantId: userId,
            status: AppealStatus.DRAFT,
        },
    });

    if (!appeal) {
        throw new NotFoundError('Appeal not found');
    }

    const payment = await prismaClient.payment.findUnique({
        where: { appealId },
    });

    if (!payment) {
        throw new NotFoundError('Payment not found.');
    }

    if (payment.razorpayOrderId !== razorpayOrderId) {
        throw new BadRequestError('Invalid order id.');
    }

    if (payment.status !== PaymentStatus.PENDING) {
        throw new BadRequestError('Payment is not pending.');
    }

    const failedPayment = await prismaClient.payment.update({
        where: { appealId },
        data: {
            status: PaymentStatus.FAILED,
            razorpayPaymentId,
            failureCode: razorpayErrorCode,
            failureReason: razorpayErrorDescription,
        },
    });

    return failedPayment;
};

import crypto from 'crypto';

export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
) {
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return expectedSignature === signature;
}

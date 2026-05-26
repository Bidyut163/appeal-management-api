import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.js';

type JWTPayload = { userId: number };

export const createJWT = (payload: JWTPayload) => {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    return token;
};

export const verifyJWT = (token: string): JWTPayload => {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: number };
};

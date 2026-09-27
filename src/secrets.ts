import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = Number(process.env.PORT) || 5000;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const FRONTEND_URL = process.env.FRONTEND_URL;

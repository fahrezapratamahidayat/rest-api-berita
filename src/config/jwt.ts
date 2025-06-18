import jwt, { Secret } from "jsonwebtoken";
import { AuthPayload } from "../types";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (payload: AuthPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token: string): AuthPayload => {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
};

export const generateRefreshToken = (payload: AuthPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import { ApiResponse } from "../types";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        name: string;
        title: string;
        avatar: string;
    };
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required",
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

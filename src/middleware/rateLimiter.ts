import rateLimit from "express-rate-limit";
import { ApiResponse } from "../types";

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000"); // 1 hour
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");

export const rateLimiter = rateLimit({
    windowMs,
    max: maxRequests,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    } as ApiResponse,
    standardHeaders: true,
    legacyHeaders: false,
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000"); // 1 hour
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs,
    max: maxRequests,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimiter.js.map
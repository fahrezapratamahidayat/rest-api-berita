"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleRoutes_1 = __importDefault(require("./articleRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const router = (0, express_1.Router)();
router.use('/news', articleRoutes_1.default);
router.use('/auth', authRoutes_1.default);
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'News API is running',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map
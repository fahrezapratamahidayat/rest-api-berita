"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const rateLimiter_1 = require("./middleware/rateLimiter");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use(rateLimiter_1.rateLimiter);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/v1", routes_1.default);
app.use((err, req, res, next) => {
    console.error("Global error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development"
            ? err.message
            : undefined,
    });
});
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Selamat datang di News API",
        version: "1.0.0",
        documentation: "/api/v1/health",
        developedBy: "Fahreza Pratama Hidayat",
        repository: "https://github.com/fahrezapratamahidayat/rest-api-berita",
    });
});
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
    });
});
app.listen(PORT, () => {
    console.log(`🚀 News API server is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/health`);
});
exports.default = app;
//# sourceMappingURL=index.js.map
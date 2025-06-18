import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes";
import { rateLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(rateLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/v1", routes);

app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error("Global error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? err.message
                    : undefined,
        });
    }
);

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

export default app;

import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes/index.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
            scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
            fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
        },
    },
}));

app.use(rateLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/v1", routes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

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

app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
    });
});

app.listen(PORT, () => {
    console.log(`🚀 News API server is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/health`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
});

export default app;

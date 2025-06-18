import { Router } from "express";
import articleRoutes from "./articleRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/news", articleRoutes);
router.use("/auth", authRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "News API is running",
        timestamp: new Date().toISOString(),
        developer: "Fahreza Pratama Hidayat",
        repository: "https://github.com/fahrezapratamahidayat/rest-api-berita",
        endpoints: {
            auth: {
                register: {
                    method: "POST",
                    path: "/api/v1/auth/register",
                    description: "Mendaftarkan pengguna baru",
                    body: {
                        email: "string (required)",
                        password: "string (required) min 16 character",
                        name: "string (required)",
                        title: "string (required)",
                        avatar: "string (required)",
                    },
                },
                login: {
                    method: "POST",
                    path: "/api/v1/auth/login",
                    description: "Masuk ke akun yang sudah terdaftar",
                    body: {
                        email: "string (required)",
                        password: "string (required)",
                    },
                },
            },
            news: {
                getAllArticles: {
                    method: "GET",
                    path: "/api/v1/news",
                    description: "Mendapatkan semua artikel berita",
                    query: {
                        page: "number (optional)",
                        limit: "number (optional)",
                        category: "string (optional)",
                    },
                },
                getTrendingArticles: {
                    method: "GET",
                    path: "/api/v1/news/trending",
                    description:
                        "Mendapatkan artikel berita yang sedang trending",
                },
                getArticleById: {
                    method: "GET",
                    path: "/api/v1/news/:id",
                    description: "Mendapatkan artikel berita berdasarkan ID",
                },
                createArticle: {
                    method: "POST",
                    path: "/api/v1/news",
                    description:
                        "Membuat artikel berita baru (memerlukan autentikasi)",
                    auth: "Bearer Token",
                    body: {
                        title: "string (required)",
                        category: "string (required)",
                        readTime: "string (required)",
                        imageUrl: "string (required)",
                        isTrending: "boolean (optional)",
                        tags: "string[] (optional)",
                        content: "string (required)",
                    },
                },
                updateArticle: {
                    method: "PUT",
                    path: "/api/v1/news/:id",
                    description:
                        "Memperbarui artikel berita (memerlukan autentikasi)",
                    auth: "Bearer Token",
                    body: "Sama seperti createArticle, semua field opsional",
                },
                deleteArticle: {
                    method: "DELETE",
                    path: "/api/v1/news/:id",
                    description:
                        "Menghapus artikel berita (memerlukan autentikasi)",
                    auth: "Bearer Token",
                },
            },
        },
    });
});

export default router;

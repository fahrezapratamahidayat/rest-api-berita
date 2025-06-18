"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const articleService_1 = require("../services/articleService");
class ArticleController {
    static async getAllArticles(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const category = req.query.category;
            let result;
            if (category) {
                const articles = await articleService_1.ArticleService.getArticlesByCategory(category);
                result = {
                    articles,
                    total: articles.length,
                    hasMore: false,
                };
            }
            else {
                result = await articleService_1.ArticleService.getAllArticles(page, limit);
            }
            res.status(200).json({
                success: true,
                message: "Articles retrieved successfully",
                data: {
                    articles: result.articles,
                    pagination: {
                        page,
                        limit,
                        total: result.total,
                        hasMore: result.hasMore,
                    },
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve articles",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async getArticleById(req, res) {
        try {
            const { id } = req.params;
            const article = await articleService_1.ArticleService.getArticleById(id);
            if (!article) {
                return res.status(404).json({
                    success: false,
                    message: "Article not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Article retrieved successfully",
                data: article,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async createArticle(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }
            const articleData = {
                ...req.body,
                authorId: req.user.userId,
            };
            const article = await articleService_1.ArticleService.createArticle(articleData);
            res.status(201).json({
                success: true,
                message: "Article created successfully",
                data: article,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async updateArticle(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }
            const { id } = req.params;
            const articleData = req.body;
            const existingArticle = await articleService_1.ArticleService.getArticleById(id);
            if (!existingArticle) {
                return res.status(404).json({
                    success: false,
                    message: "Article not found",
                });
            }
            if (existingArticle.authorId !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to update this article",
                });
            }
            const article = await articleService_1.ArticleService.updateArticle(id, articleData);
            res.status(200).json({
                success: true,
                message: "Article updated successfully",
                data: article,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async deleteArticle(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }
            const { id } = req.params;
            const existingArticle = await articleService_1.ArticleService.getArticleById(id);
            if (!existingArticle) {
                return res.status(404).json({
                    success: false,
                    message: "Article not found",
                });
            }
            if (existingArticle.authorId !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to delete this article",
                });
            }
            const deleted = await articleService_1.ArticleService.deleteArticle(id);
            res.status(200).json({
                success: true,
                message: "Article deleted successfully",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async getTrendingArticles(req, res) {
        try {
            const articles = await articleService_1.ArticleService.getTrendingArticles();
            res.status(200).json({
                success: true,
                message: "Trending articles retrieved successfully",
                data: articles,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve trending articles",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.ArticleController = ArticleController;
//# sourceMappingURL=articleController.js.map
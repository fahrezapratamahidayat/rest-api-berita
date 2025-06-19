import { Request, Response } from "express";
import { ArticleService } from "../services/articleService";
import { ApiResponse, CreateArticleInput, UpdateArticleInput } from "../types";
import { AuthRequest } from "../middleware/auth";
import { articles, db, savedArticles } from "../db";
import { eq } from "drizzle-orm";

export class ArticleController {
    static async getAllArticles(req: Request, res: Response<ApiResponse>) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const category = req.query.category as string;

            let result;
            if (category) {
                const articles = await ArticleService.getArticlesByCategory(
                    category
                );
                result = {
                    articles,
                    total: articles.length,
                    hasMore: false,
                };
            } else {
                result = await ArticleService.getAllArticles(page, limit);
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
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve articles",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async getArticleById(req: Request, res: Response<ApiResponse>) {
        try {
            const { id } = req.params;
            const article = await ArticleService.getArticleById(id);

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
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async createArticle(req: AuthRequest, res: Response<ApiResponse>) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const articleData: CreateArticleInput = {
                ...req.body,
                authorId: req.user.userId,
            };

            const article = await ArticleService.createArticle(articleData);

            res.status(201).json({
                success: true,
                message: "Article created successfully",
                data: article,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async updateArticle(req: AuthRequest, res: Response<ApiResponse>) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const { id } = req.params;
            const articleData: UpdateArticleInput = req.body;

            const existingArticle = await ArticleService.getArticleById(id);
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

            const article = await ArticleService.updateArticle(id, articleData);

            res.status(200).json({
                success: true,
                message: "Article updated successfully",
                data: article,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async deleteArticle(req: AuthRequest, res: Response<ApiResponse>) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const { id } = req.params;

            const existingArticle = await ArticleService.getArticleById(id);

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

            const deleted = await ArticleService.deleteArticleSimple(id);

            if (!deleted) {
                const deletedWithTransaction =
                    await ArticleService.deleteArticle(id);

                if (!deletedWithTransaction) {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to delete article - no rows affected",
                    });
                }
            }

            const finalCheck = await ArticleService.getArticleById(id);

            res.status(200).json({
                success: true,
                message: "Article deleted successfully",
                data: {
                    deleted: true,
                    finalVerification: !finalCheck,
                },
            });
        } catch (error) {
            console.error("💥 Controller error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to delete article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async getTrendingArticles(req: Request, res: Response<ApiResponse>) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const category = req.query.category as string;

            const result = await ArticleService.getTrendingArticles(
                page,
                limit
            );
            if (category) {
                const articles = result.articles.filter(
                    (article) => article.category === category
                );
                result.articles = articles;
                result.total = articles.length;
                result.hasMore = articles.length > limit;
            }

            res.status(200).json({
                success: true,
                message: "Articles trending retrieved successfully",
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
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve trending articles",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async getUserArticles(req: AuthRequest, res: Response<ApiResponse>) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const articles = await ArticleService.getArticlesByUser(
                req.user.userId,
                page,
                limit
            );

            res.status(200).json({
                success: true,
                message: "Your Article successfully",
                data: {
                    articles: articles.articles,
                    pagination: {
                        page,
                        limit,
                        total: articles.total,
                        hasMore: articles.hasMore,
                    },
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve your articles",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async saveArticle(req: AuthRequest, res: Response<ApiResponse>) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const { id } = req.params;
            const userId = req.user.userId;

            await ArticleService.saveArticle(userId, id);

            res.status(200).json({
                success: true,
                message: "Article saved to bookmarks",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to save article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async unsaveArticle(req: AuthRequest, res: Response<ApiResponse>) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const { id } = req.params;
            const userId = req.user.userId;

            const result = await ArticleService.unsaveArticle(userId, id);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Article not found in your bookmarks",
                });
            }

            res.status(200).json({
                success: true,
                message: "Article removed from bookmarks",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to remove article from bookmarks",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async getSavedArticles(
        req: AuthRequest,
        res: Response<ApiResponse>
    ) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const userId = req.user.userId;
            const articles = await ArticleService.getSavedArticles(userId);

            res.status(200).json({
                success: true,
                message: "Bookmarked articles retrieved successfully",
                data: {
                    articles: articles.articles,
                    pagination: {
                        page,
                        limit,
                        total: articles.total,
                        hasMore: articles.hasMore,
                    },
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve bookmarked articles",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async checkSavedStatus(
        req: AuthRequest,
        res: Response<ApiResponse>
    ) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const { id } = req.params;
            const userId = req.user.userId;

            const isSaved = await ArticleService.isSaved(userId, id);

            res.status(200).json({
                success: true,
                message: "Bookmark status retrieved",
                data: { isSaved },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to check bookmark status",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}

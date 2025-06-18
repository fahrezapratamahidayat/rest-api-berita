import { Request, Response } from "express";
import { ArticleService } from "../services/articleService";
import { ApiResponse, CreateArticleInput, UpdateArticleInput } from "../types";
import { AuthRequest } from "../middleware/auth";

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

            const deleted = await ArticleService.deleteArticle(id);

            res.status(200).json({
                success: true,
                message: "Article deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to delete article",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async getTrendingArticles(req: Request, res: Response<ApiResponse>) {
        try {
            const articles = await ArticleService.getTrendingArticles();

            res.status(200).json({
                success: true,
                message: "Trending articles retrieved successfully",
                data: articles,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve trending articles",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}

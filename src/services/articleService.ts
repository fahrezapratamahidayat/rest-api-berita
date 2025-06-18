import {
    db,
    articles,
    Article,
    NewArticle,
    users,
    ArticleWithAuthor,
    savedArticles,
} from "../db";
import { eq, desc, and } from "drizzle-orm";
import { CreateArticleInput, UpdateArticleInput } from "../types";
import { createId } from "@paralleldrive/cuid2";

export class ArticleService {
    static async getAllArticles(
        page: number = 1,
        limit: number = 10
    ): Promise<{
        articles: ArticleWithAuthor[];
        total: number;
        hasMore: boolean;
    }> {
        const offset = (page - 1) * limit;

        try {
            const articlesList = await db
                .select({
                    id: articles.id,
                    title: articles.title,
                    category: articles.category,
                    publishedAt: articles.publishedAt,
                    readTime: articles.readTime,
                    imageUrl: articles.imageUrl,
                    isTrending: articles.isTrending,
                    tags: articles.tags,
                    content: articles.content,
                    createdAt: articles.createdAt,
                    updatedAt: articles.updatedAt,
                    author: {
                        name: users.name,
                        title: users.title,
                        avatar: users.avatar,
                    },
                })
                .from(articles)
                .leftJoin(users, eq(articles.authorId, users.id))
                .orderBy(desc(articles.createdAt))
                .limit(limit)
                .offset(offset);

            const totalResult = await db
                .select({ count: articles.id })
                .from(articles);

            const total = totalResult.length;

            return {
                articles: articlesList,
                total,
                hasMore: total > offset + limit,
            };
        } catch (error) {
            throw new Error(
                `Failed to fetch articles: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async getArticleById(id: string): Promise<ArticleWithAuthor | null> {
        try {
            const result = await db
                .select({
                    id: articles.id,
                    title: articles.title,
                    category: articles.category,
                    publishedAt: articles.publishedAt,
                    readTime: articles.readTime,
                    imageUrl: articles.imageUrl,
                    isTrending: articles.isTrending,
                    tags: articles.tags,
                    content: articles.content,
                    createdAt: articles.createdAt,
                    updatedAt: articles.updatedAt,
                    author: {
                        name: users.name,
                        title: users.title,
                        avatar: users.avatar,
                    },
                })
                .from(articles)
                .leftJoin(users, eq(articles.authorId, users.id))
                .where(eq(articles.id, id))
                .limit(1);

            return result[0] || null;
        } catch (error) {
            throw new Error(
                `Failed to fetch article: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async createArticle(
        articleData: CreateArticleInput
    ): Promise<Article> {
        try {
            const newArticle: NewArticle = {
                id: createId(),
                ...articleData,
                publishedAt: new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                isTrending: articleData.isTrending || false,
            };

            const result = await db
                .insert(articles)
                .values(newArticle)
                .returning();

            return result[0];
        } catch (error) {
            throw new Error(
                `Failed to create article: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async updateArticle(
        id: string,
        articleData: UpdateArticleInput
    ): Promise<Article | null> {
        try {
            const result = await db
                .update(articles)
                .set({
                    ...articleData,
                    updatedAt: new Date(),
                })
                .where(eq(articles.id, id))
                .returning();

            return result[0] || null;
        } catch (error) {
            throw new Error(
                `Failed to update article: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async deleteArticle(id: string): Promise<boolean> {
        try {
            const result = await db
                .delete(articles)
                .where(eq(articles.id, id))
                .returning();

            return result.length > 0;
        } catch (error) {
            throw new Error(
                `Failed to delete article: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async getArticlesByCategory(category: string): Promise<Article[]> {
        try {
            const result = await db
                .select()
                .from(articles)
                .where(eq(articles.category, category))
                .orderBy(desc(articles.createdAt));

            return result;
        } catch (error) {
            throw new Error(
                `Failed to fetch articles by category: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async getTrendingArticles(): Promise<Article[]> {
        try {
            const result = await db
                .select()
                .from(articles)
                .where(eq(articles.isTrending, true))
                .orderBy(desc(articles.createdAt));

            return result;
        } catch (error) {
            throw new Error(
                `Failed to fetch trending articles: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async getArticlesByUser(
        userId: string
    ): Promise<ArticleWithAuthor[]> {
        try {
            const result = await db
                .select({
                    id: articles.id,
                    title: articles.title,
                    category: articles.category,
                    publishedAt: articles.publishedAt,
                    readTime: articles.readTime,
                    imageUrl: articles.imageUrl,
                    isTrending: articles.isTrending,
                    tags: articles.tags,
                    content: articles.content,
                    createdAt: articles.createdAt,
                    updatedAt: articles.updatedAt,
                    author: {
                        name: users.name,
                        title: users.title,
                        avatar: users.avatar,
                    },
                })
                .from(articles)
                .leftJoin(users, eq(articles.authorId, users.id))
                .where(eq(articles.authorId, userId))
                .orderBy(desc(articles.createdAt));

            return result;
        } catch (error) {
            throw new Error(
                `Failed to fetch user articles: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async saveArticle(
        userId: string,
        articleId: string
    ): Promise<boolean> {
        try {
            // Check if article exists
            const article = await this.getArticleById(articleId);
            if (!article) {
                throw new Error("Article not found");
            }

            // Check if already saved
            const existing = await db
                .select()
                .from(savedArticles)
                .where(
                    and(
                        eq(savedArticles.userId, userId),
                        eq(savedArticles.articleId, articleId)
                    )
                )
                .limit(1);

            if (existing.length > 0) {
                return true; // Already saved
            }

            // Save article
            await db.insert(savedArticles).values({
                userId,
                articleId,
            });

            return true;
        } catch (error) {
            throw new Error(
                `Failed to save article: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async unsaveArticle(
        userId: string,
        articleId: string
    ): Promise<boolean> {
        try {
            const result = await db
                .delete(savedArticles)
                .where(
                    and(
                        eq(savedArticles.userId, userId),
                        eq(savedArticles.articleId, articleId)
                    )
                )
                .returning();

            return result.length > 0;
        } catch (error) {
            throw new Error(
                `Failed to unsave article: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async getSavedArticles(
        userId: string
    ): Promise<ArticleWithAuthor[]> {
        try {
            const result = await db
                .select({
                    id: articles.id,
                    title: articles.title,
                    category: articles.category,
                    publishedAt: articles.publishedAt,
                    readTime: articles.readTime,
                    imageUrl: articles.imageUrl,
                    isTrending: articles.isTrending,
                    tags: articles.tags,
                    content: articles.content,
                    createdAt: articles.createdAt,
                    updatedAt: articles.updatedAt,
                    author: {
                        name: users.name,
                        title: users.title,
                        avatar: users.avatar,
                    },
                })
                .from(savedArticles)
                .innerJoin(articles, eq(savedArticles.articleId, articles.id))
                .leftJoin(users, eq(articles.authorId, users.id))
                .where(eq(savedArticles.userId, userId))
                .orderBy(desc(savedArticles.savedAt));

            return result;
        } catch (error) {
            throw new Error(
                `Failed to fetch saved articles: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async isSaved(userId: string, articleId: string): Promise<boolean> {
        try {
            const result = await db
                .select()
                .from(savedArticles)
                .where(
                    and(
                        eq(savedArticles.userId, userId),
                        eq(savedArticles.articleId, articleId)
                    )
                )
                .limit(1);

            return result.length > 0;
        } catch (error) {
            throw new Error(
                `Failed to check saved status: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }
}

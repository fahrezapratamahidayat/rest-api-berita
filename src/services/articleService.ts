import {
    db,
    articles,
    Article,
    NewArticle,
    users,
    ArticleWithAuthor,
} from "../db";
import { eq, desc } from "drizzle-orm";
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
}

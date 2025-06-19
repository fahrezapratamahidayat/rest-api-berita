"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const cuid2_1 = require("@paralleldrive/cuid2");
class ArticleService {
    static async getAllArticles(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        try {
            const articlesList = await db_1.db
                .select({
                id: db_1.articles.id,
                title: db_1.articles.title,
                category: db_1.articles.category,
                publishedAt: db_1.articles.publishedAt,
                readTime: db_1.articles.readTime,
                imageUrl: db_1.articles.imageUrl,
                isTrending: db_1.articles.isTrending,
                tags: db_1.articles.tags,
                content: db_1.articles.content,
                createdAt: db_1.articles.createdAt,
                updatedAt: db_1.articles.updatedAt,
                author: {
                    name: db_1.users.name,
                    title: db_1.users.title,
                    avatar: db_1.users.avatar,
                },
            })
                .from(db_1.articles)
                .leftJoin(db_1.users, (0, drizzle_orm_1.eq)(db_1.articles.authorId, db_1.users.id))
                .orderBy((0, drizzle_orm_1.desc)(db_1.articles.createdAt))
                .limit(limit)
                .offset(offset);
            const totalResult = await db_1.db
                .select({ count: db_1.articles.id })
                .from(db_1.articles);
            const total = totalResult.length;
            return {
                articles: articlesList,
                total,
                hasMore: total > offset + limit,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch articles: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async getArticleById(id) {
        try {
            const result = await db_1.db
                .select({
                id: db_1.articles.id,
                title: db_1.articles.title,
                category: db_1.articles.category,
                publishedAt: db_1.articles.publishedAt,
                readTime: db_1.articles.readTime,
                imageUrl: db_1.articles.imageUrl,
                isTrending: db_1.articles.isTrending,
                tags: db_1.articles.tags,
                content: db_1.articles.content,
                authorId: db_1.articles.authorId,
                createdAt: db_1.articles.createdAt,
                updatedAt: db_1.articles.updatedAt,
                author: {
                    name: db_1.users.name,
                    title: db_1.users.title,
                    avatar: db_1.users.avatar,
                },
            })
                .from(db_1.articles)
                .leftJoin(db_1.users, (0, drizzle_orm_1.eq)(db_1.articles.authorId, db_1.users.id))
                .where((0, drizzle_orm_1.eq)(db_1.articles.id, id))
                .limit(1);
            return result[0] || null;
        }
        catch (error) {
            throw new Error(`Failed to fetch article: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async createArticle(articleData) {
        try {
            const newArticle = {
                id: (0, cuid2_1.createId)(),
                ...articleData,
                publishedAt: new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                isTrending: articleData.isTrending || false,
            };
            const result = await db_1.db
                .insert(db_1.articles)
                .values(newArticle)
                .returning();
            return result[0];
        }
        catch (error) {
            throw new Error(`Failed to create article: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async updateArticle(id, articleData) {
        try {
            const result = await db_1.db
                .update(db_1.articles)
                .set({
                ...articleData,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(db_1.articles.id, id))
                .returning();
            return result[0] || null;
        }
        catch (error) {
            throw new Error(`Failed to update article: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async deleteArticle(id) {
        console.log("🔍 Starting delete process for article ID:", id);
        try {
            return await db_1.db.transaction(async (tx) => {
                console.log("📝 Transaction started");
                // 1. Cek artikel ada atau tidak sebelum hapus
                const existingArticle = await tx
                    .select()
                    .from(db_1.articles)
                    .where((0, drizzle_orm_1.eq)(db_1.articles.id, id));
                console.log("📄 Article exists before delete:", existingArticle.length > 0);
                if (existingArticle.length === 0) {
                    console.log("❌ Article not found in database");
                    return false;
                }
                // 2. Cek saved articles yang akan dihapus
                const savedArticlesToDelete = await tx
                    .select()
                    .from(db_1.savedArticles)
                    .where((0, drizzle_orm_1.eq)(db_1.savedArticles.articleId, id));
                console.log("💾 Saved articles to delete:", savedArticlesToDelete.length);
                // 3. Hapus saved articles terlebih dahulu
                const deletedSavedArticles = await tx
                    .delete(db_1.savedArticles)
                    .where((0, drizzle_orm_1.eq)(db_1.savedArticles.articleId, id))
                    .returning();
                console.log("🗑️ Saved articles deleted:", deletedSavedArticles.length);
                // 4. Hapus artikel
                const deletedArticles = await tx
                    .delete(db_1.articles)
                    .where((0, drizzle_orm_1.eq)(db_1.articles.id, id))
                    .returning();
                console.log("📰 Articles deleted:", deletedArticles.length);
                // 5. Verify artikel benar-benar terhapus
                const verifyDeleted = await tx
                    .select()
                    .from(db_1.articles)
                    .where((0, drizzle_orm_1.eq)(db_1.articles.id, id));
                console.log("✅ Verification - Article still exists:", verifyDeleted.length > 0);
                const success = deletedArticles.length > 0 && verifyDeleted.length === 0;
                console.log("🎯 Delete operation success:", success);
                return success;
            });
        }
        catch (error) {
            console.error("💥 Delete operation failed:", error);
            throw new Error(`Failed to delete article: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async deleteArticleSimple(id) {
        console.log('🔍 Simple delete for article ID:', id);
        try {
            // 1. Hapus saved articles dulu
            const deletedSaved = await db_1.db
                .delete(db_1.savedArticles)
                .where((0, drizzle_orm_1.eq)(db_1.savedArticles.articleId, id))
                .returning();
            console.log('💾 Saved articles deleted:', deletedSaved.length);
            // 2. Hapus artikel
            const deletedArticles = await db_1.db
                .delete(db_1.articles)
                .where((0, drizzle_orm_1.eq)(db_1.articles.id, id))
                .returning();
            console.log('📰 Articles deleted:', deletedArticles.length);
            // 3. Verify
            const verify = await db_1.db
                .select()
                .from(db_1.articles)
                .where((0, drizzle_orm_1.eq)(db_1.articles.id, id));
            console.log('✅ Article still exists after delete:', verify.length > 0);
            return deletedArticles.length > 0 && verify.length === 0;
        }
        catch (error) {
            console.error('💥 Simple delete failed:', error);
            throw error;
        }
    }
    static async getArticlesByCategory(category) {
        try {
            const result = await db_1.db
                .select()
                .from(db_1.articles)
                .where((0, drizzle_orm_1.eq)(db_1.articles.category, category))
                .orderBy((0, drizzle_orm_1.desc)(db_1.articles.createdAt));
            return result;
        }
        catch (error) {
            throw new Error(`Failed to fetch articles by category: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async getTrendingArticles(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        try {
            const articlesList = await db_1.db
                .select({
                id: db_1.articles.id,
                title: db_1.articles.title,
                category: db_1.articles.category,
                publishedAt: db_1.articles.publishedAt,
                readTime: db_1.articles.readTime,
                imageUrl: db_1.articles.imageUrl,
                isTrending: db_1.articles.isTrending,
                tags: db_1.articles.tags,
                content: db_1.articles.content,
                createdAt: db_1.articles.createdAt,
                updatedAt: db_1.articles.updatedAt,
                author: {
                    name: db_1.users.name,
                    title: db_1.users.title,
                    avatar: db_1.users.avatar,
                },
            })
                .from(db_1.articles)
                .leftJoin(db_1.users, (0, drizzle_orm_1.eq)(db_1.articles.authorId, db_1.users.id))
                .orderBy((0, drizzle_orm_1.desc)(db_1.articles.createdAt))
                .where((0, drizzle_orm_1.eq)(db_1.articles.isTrending, true))
                .limit(limit)
                .offset(offset);
            const totalResult = await db_1.db
                .select({ count: db_1.articles.id })
                .from(db_1.articles);
            const total = totalResult.length;
            return {
                articles: articlesList,
                total,
                hasMore: total > offset + limit,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch trending articles: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async getArticlesByUser(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        try {
            const articlesList = await db_1.db
                .select({
                id: db_1.articles.id,
                title: db_1.articles.title,
                category: db_1.articles.category,
                publishedAt: db_1.articles.publishedAt,
                readTime: db_1.articles.readTime,
                imageUrl: db_1.articles.imageUrl,
                isTrending: db_1.articles.isTrending,
                tags: db_1.articles.tags,
                content: db_1.articles.content,
                authorId: db_1.articles.authorId,
                author: {
                    name: db_1.users.name,
                    title: db_1.users.title,
                    avatar: db_1.users.avatar,
                },
                createdAt: db_1.articles.createdAt,
                updatedAt: db_1.articles.updatedAt,
            })
                .from(db_1.articles)
                .leftJoin(db_1.users, (0, drizzle_orm_1.eq)(db_1.articles.authorId, db_1.users.id))
                .where((0, drizzle_orm_1.eq)(db_1.articles.authorId, userId))
                .orderBy((0, drizzle_orm_1.desc)(db_1.articles.createdAt));
            const totalResult = await db_1.db
                .select({ count: db_1.articles.id })
                .from(db_1.articles);
            const total = totalResult.length;
            return {
                articles: articlesList,
                total,
                hasMore: total > offset + limit,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch user articles: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async saveArticle(userId, articleId) {
        try {
            // Check if article exists
            const article = await this.getArticleById(articleId);
            if (!article) {
                throw new Error("Article not found");
            }
            // Check if already saved
            const existing = await db_1.db
                .select()
                .from(db_1.savedArticles)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.savedArticles.userId, userId), (0, drizzle_orm_1.eq)(db_1.savedArticles.articleId, articleId)))
                .limit(1);
            if (existing.length > 0) {
                return true; // Already saved
            }
            // Save article
            await db_1.db.insert(db_1.savedArticles).values({
                userId,
                articleId,
            });
            return true;
        }
        catch (error) {
            throw new Error(`Failed to save article: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async unsaveArticle(userId, articleId) {
        try {
            const result = await db_1.db
                .delete(db_1.savedArticles)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.savedArticles.userId, userId), (0, drizzle_orm_1.eq)(db_1.savedArticles.articleId, articleId)))
                .returning();
            return result.length > 0;
        }
        catch (error) {
            throw new Error(`Failed to unsave article: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async getSavedArticles(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        try {
            const articlesList = await db_1.db
                .select({
                id: db_1.articles.id,
                title: db_1.articles.title,
                category: db_1.articles.category,
                publishedAt: db_1.articles.publishedAt,
                readTime: db_1.articles.readTime,
                imageUrl: db_1.articles.imageUrl,
                isTrending: db_1.articles.isTrending,
                tags: db_1.articles.tags,
                content: db_1.articles.content,
                createdAt: db_1.articles.createdAt,
                updatedAt: db_1.articles.updatedAt,
                author: {
                    name: db_1.users.name,
                    title: db_1.users.title,
                    avatar: db_1.users.avatar,
                },
            })
                .from(db_1.savedArticles)
                .innerJoin(db_1.articles, (0, drizzle_orm_1.eq)(db_1.savedArticles.articleId, db_1.articles.id))
                .leftJoin(db_1.users, (0, drizzle_orm_1.eq)(db_1.articles.authorId, db_1.users.id))
                .where((0, drizzle_orm_1.eq)(db_1.savedArticles.userId, userId))
                .orderBy((0, drizzle_orm_1.desc)(db_1.savedArticles.savedAt));
            const totalResult = await db_1.db
                .select({ count: db_1.articles.id })
                .from(db_1.articles);
            const total = totalResult.length;
            return {
                articles: articlesList,
                total,
                hasMore: total > offset + limit,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch saved articles: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async isSaved(userId, articleId) {
        try {
            const result = await db_1.db
                .select()
                .from(db_1.savedArticles)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.savedArticles.userId, userId), (0, drizzle_orm_1.eq)(db_1.savedArticles.articleId, articleId)))
                .limit(1);
            return result.length > 0;
        }
        catch (error) {
            throw new Error(`Failed to check saved status: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}
exports.ArticleService = ArticleService;
//# sourceMappingURL=articleService.js.map
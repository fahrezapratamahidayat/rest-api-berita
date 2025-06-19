import { Article, ArticleWithAuthor } from "../db";
import { CreateArticleInput, UpdateArticleInput } from "../types";
export declare class ArticleService {
    static getAllArticles(page?: number, limit?: number): Promise<{
        articles: ArticleWithAuthor[];
        total: number;
        hasMore: boolean;
    }>;
    static getArticleById(id: string): Promise<ArticleWithAuthor | null>;
    static createArticle(articleData: CreateArticleInput): Promise<Article>;
    static updateArticle(id: string, articleData: UpdateArticleInput): Promise<Article | null>;
    static deleteArticle(id: string): Promise<boolean>;
    static deleteArticleSimple(id: string): Promise<boolean>;
    static getArticlesByCategory(category: string): Promise<Article[]>;
    static getTrendingArticles(page?: number, limit?: number): Promise<{
        articles: ArticleWithAuthor[];
        total: number;
        hasMore: boolean;
    }>;
    static getArticlesByUser(userId: string, page?: number, limit?: number): Promise<{
        articles: Article[];
        total: number;
        hasMore: boolean;
    }>;
    static saveArticle(userId: string, articleId: string): Promise<boolean>;
    static unsaveArticle(userId: string, articleId: string): Promise<boolean>;
    static getSavedArticles(userId: string, page?: number, limit?: number): Promise<{
        articles: ArticleWithAuthor[];
        total: number;
        hasMore: boolean;
    }>;
    static isSaved(userId: string, articleId: string): Promise<boolean>;
}
//# sourceMappingURL=articleService.d.ts.map
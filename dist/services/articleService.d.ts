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
    static getArticlesByCategory(category: string): Promise<Article[]>;
    static getTrendingArticles(): Promise<Article[]>;
}
//# sourceMappingURL=articleService.d.ts.map
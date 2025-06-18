import { Request, Response } from "express";
import { ApiResponse } from "../types";
import { AuthRequest } from "../middleware/auth";
export declare class ArticleController {
    static getAllArticles(req: Request, res: Response<ApiResponse>): Promise<void>;
    static getArticleById(req: Request, res: Response<ApiResponse>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static createArticle(req: AuthRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static updateArticle(req: AuthRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static deleteArticle(req: AuthRequest, res: Response<ApiResponse>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static getTrendingArticles(req: Request, res: Response<ApiResponse>): Promise<void>;
}
//# sourceMappingURL=articleController.d.ts.map
import { Request, Response } from "express";
import { ApiResponse } from "../types";
export declare class AuthController {
    static register(req: Request, res: Response<ApiResponse>): Promise<void>;
    static login(req: Request, res: Response<ApiResponse>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static refreshToken(req: Request, res: Response<ApiResponse>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
}
//# sourceMappingURL=authController.d.ts.map
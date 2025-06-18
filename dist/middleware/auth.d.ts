import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        name: string;
        title: string;
        avatar: string;
    };
}
export declare const authenticateToken: (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map
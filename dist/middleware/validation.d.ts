import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";
export declare const validateRequest: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined;
export declare const validateArticleCreation: (((req: Request, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validateArticleUpdate: (((req: Request, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validateArticleId: (((req: Request, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validateUserRegistration: (((req: Request, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
export declare const validateUserLogin: (((req: Request, res: Response<ApiResponse>, next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined) | import("express-validator").ValidationChain)[];
//# sourceMappingURL=validation.d.ts.map
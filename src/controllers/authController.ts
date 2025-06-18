import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { generateRefreshToken, generateToken, verifyToken } from "../config/jwt";
import { ApiResponse } from "../types";

export class AuthController {
    static async register(req: Request, res: Response<ApiResponse>) {
        try {
            const { email, password, name, title, avatar } = req.body;

            const user = await AuthService.registerUser(
                email,
                password,
                name,
                title,
                avatar
            );
            const token = generateToken({
                userId: user.id,
                email: user.email,
                name: user.name,
                title: user.title,
                avatar: user.avatar,
            });

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        title: user.title,
                        avatar: user.avatar,
                    },
                    token,
                },
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Registration failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async login(req: Request, res: Response<ApiResponse>) {
        try {
            const { email, password } = req.body;

            const user = await AuthService.loginUser(email, password);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
            }

            const token = generateToken({
                userId: user.id,
                email: user.email,
                name: user.name,
                title: user.title,
                avatar: user.avatar,
            });

            res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        title: user.title,
                        avatar: user.avatar,
                    },
                    token,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Login failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

static async refreshToken(req: Request, res: Response<ApiResponse>) {
    try {
        const { refreshToken } = req.body;

        const decoded = verifyToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const newToken = generateToken({
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            title: decoded.title,
            avatar: decoded.avatar,
        });

        res.status(200).json({
            success: true,
            message: "Token refreshed",
            data: { token: newToken }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid refresh token",
        });
    }
}
}

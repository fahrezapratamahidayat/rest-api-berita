"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const jwt_1 = require("../config/jwt");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, name, title, avatar } = req.body;
            const user = await authService_1.AuthService.registerUser(email, password, name, title, avatar);
            const token = (0, jwt_1.generateToken)({
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: "Registration failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await authService_1.AuthService.loginUser(email, password);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
            }
            const token = (0, jwt_1.generateToken)({
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Login failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const decoded = (0, jwt_1.verifyToken)(refreshToken);
            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid refresh token",
                });
            }
            const newToken = (0, jwt_1.generateToken)({
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
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map
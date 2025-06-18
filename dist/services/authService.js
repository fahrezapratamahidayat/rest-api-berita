"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    static async registerUser(email, password, name, title, avatar) {
        try {
            const existingUser = await db_1.db
                .select()
                .from(db_1.users)
                .where((0, drizzle_orm_1.eq)(db_1.users.email, email))
                .limit(1);
            if (existingUser.length > 0) {
                throw new Error("User already exists with this email");
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const newUser = {
                email,
                password: hashedPassword,
                name,
                title,
                avatar,
            };
            const result = await db_1.db.insert(db_1.users).values(newUser).returning();
            return result[0];
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static async loginUser(email, password) {
        try {
            const result = await db_1.db
                .select()
                .from(db_1.users)
                .where((0, drizzle_orm_1.eq)(db_1.users.email, email))
                .limit(1);
            if (result.length === 0) {
                return null;
            }
            const user = result[0];
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            return user;
        }
        catch (error) {
            return null;
        }
    }
    static async getUserById(id) {
        try {
            const result = await db_1.db
                .select()
                .from(db_1.users)
                .where((0, drizzle_orm_1.eq)(db_1.users.id, id))
                .limit(1);
            return result[0] || null;
        }
        catch (error) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map
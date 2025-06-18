import { db, users, User, NewUser } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export class AuthService {
    static async registerUser(
        email: string,
        password: string,
        name: string,
        title: string,
        avatar: string
    ): Promise<User> {
        try {
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (existingUser.length > 0) {
                throw new Error("User already exists with this email");
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser: NewUser = {
                email,
                password: hashedPassword,
                name,
                title,
                avatar,
            };

            const result = await db.insert(users).values(newUser).returning();

            return result[0];
        } catch (error) {
            throw new Error(
                `Failed to create user: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    static async loginUser(
        email: string,
        password: string
    ): Promise<User | null> {
        try {
            const result = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (result.length === 0) {
                return null;
            }

            const user = result[0];
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            return null;
        }
    }

    static async getUserById(id: string): Promise<User | null> {
        try {
            const result = await db
                .select()
                .from(users)
                .where(eq(users.id, id))
                .limit(1);

            return result[0] || null;
        } catch (error) {
            return null;
        }
    }
}

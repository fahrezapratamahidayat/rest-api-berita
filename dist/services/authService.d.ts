import { User } from "../db";
export declare class AuthService {
    static registerUser(email: string, password: string, name: string, title: string, avatar: string): Promise<User>;
    static loginUser(email: string, password: string): Promise<User | null>;
    static getUserById(id: string): Promise<User | null>;
}
//# sourceMappingURL=authService.d.ts.map
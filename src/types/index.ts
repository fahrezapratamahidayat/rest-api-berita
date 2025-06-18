export interface Author {
    id: string;
    name: string;
    title: string;
    avatar: string;
}

export interface Article {
    id: string;
    title: string;
    category: string;
    publishedAt: string;
    readTime: string;
    imageUrl: string;
    isTrending: boolean;
    tags: string[];
    content: string;
    authorId: string;
    author?: Author;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateArticleInput {
    title: string;
    category: string;
    readTime: string;
    imageUrl: string;
    isTrending?: boolean;
    tags: string[];
    content: string;
    authorId: string;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    title?: string;
    avatar?: string;
    createdAt: Date;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface AuthPayload {
    userId: string;
    email: string;
    name: string;
    title: string;
    avatar: string;
}

import { pgTable, text, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    title: text("title").notNull(),
    avatar: text("avatar").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    title: text("title").notNull(),
    category: text("category").notNull(),
    publishedAt: text("published_at").notNull(),
    readTime: text("read_time").notNull(),
    imageUrl: text("image_url").notNull(),
    isTrending: boolean("is_trending").default(false).notNull(),
    tags: text("tags").array(),
    content: text("content").notNull(),
    authorId: uuid("author_id")
        .notNull()
        .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
    author: one(users, {
        fields: [articles.authorId],
        references: [users.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type ArticleWithAuthor = Omit<Article, "authorId"> & {
    authorId?: string;
    author: {
        name: string;
        title: string | null;
        avatar: string | null;
    } | null;
};
export type NewArticle = typeof articles.$inferInsert;

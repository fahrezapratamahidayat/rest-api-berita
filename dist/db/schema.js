"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedArticlesRelations = exports.articlesRelations = exports.usersRelations = exports.savedArticles = exports.articles = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const cuid2_1 = require("@paralleldrive/cuid2");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    avatar: (0, pg_core_1.text)("avatar").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.articles = (0, pg_core_1.pgTable)("articles", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => (0, cuid2_1.createId)()),
    title: (0, pg_core_1.text)("title").notNull(),
    category: (0, pg_core_1.text)("category").notNull(),
    publishedAt: (0, pg_core_1.text)("published_at").notNull(),
    readTime: (0, pg_core_1.text)("read_time").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    isTrending: (0, pg_core_1.boolean)("is_trending").default(false).notNull(),
    tags: (0, pg_core_1.text)("tags").array(),
    content: (0, pg_core_1.text)("content").notNull(),
    authorId: (0, pg_core_1.uuid)("author_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.savedArticles = (0, pg_core_1.pgTable)("saved_articles", {
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    articleId: (0, pg_core_1.text)("article_id")
        .notNull()
        .references(() => exports.articles.id, { onDelete: "cascade" }),
    savedAt: (0, pg_core_1.timestamp)("saved_at").defaultNow().notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.articleId] }),
    };
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    articles: many(exports.articles),
}));
exports.articlesRelations = (0, drizzle_orm_1.relations)(exports.articles, ({ one }) => ({
    author: one(exports.users, {
        fields: [exports.articles.authorId],
        references: [exports.users.id],
    }),
}));
exports.savedArticlesRelations = (0, drizzle_orm_1.relations)(exports.savedArticles, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.savedArticles.userId],
        references: [exports.users.id],
    }),
    article: one(exports.articles, {
        fields: [exports.savedArticles.articleId],
        references: [exports.articles.id],
    }),
}));
//# sourceMappingURL=schema.js.map
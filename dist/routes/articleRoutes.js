"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleController_1 = require("../controllers/articleController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Public routes
router.get("/", articleController_1.ArticleController.getAllArticles);
router.get("/trending", articleController_1.ArticleController.getTrendingArticles);
router.get("/:id", validation_1.validateArticleId, articleController_1.ArticleController.getArticleById);
// Protected routes
router.post("/", auth_1.authenticateToken, validation_1.validateArticleCreation, articleController_1.ArticleController.createArticle);
router.put("/:id", auth_1.authenticateToken, validation_1.validateArticleId, validation_1.validateArticleUpdate, articleController_1.ArticleController.updateArticle);
router.delete("/:id", auth_1.authenticateToken, validation_1.validateArticleId, articleController_1.ArticleController.deleteArticle);
// User's articles routes
router.get("/user/me", auth_1.authenticateToken, articleController_1.ArticleController.getUserArticles);
// Bookmark routes
router.get("/bookmarks/list", auth_1.authenticateToken, articleController_1.ArticleController.getSavedArticles);
router.post("/:id/bookmark", auth_1.authenticateToken, validation_1.validateArticleId, articleController_1.ArticleController.saveArticle);
router.delete("/:id/bookmark", auth_1.authenticateToken, validation_1.validateArticleId, articleController_1.ArticleController.unsaveArticle);
router.get("/:id/bookmark", auth_1.authenticateToken, articleController_1.ArticleController.checkSavedStatus);
exports.default = router;
//# sourceMappingURL=articleRoutes.js.map
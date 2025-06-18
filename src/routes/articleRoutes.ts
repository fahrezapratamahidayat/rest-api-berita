import { Router } from "express";
import { ArticleController } from "../controllers/articleController";
import { authenticateToken } from "../middleware/auth";
import {
    validateArticleCreation,
    validateArticleUpdate,
    validateArticleId,
} from "../middleware/validation";

const router = Router();

// Public routes
router.get("/", ArticleController.getAllArticles);
router.get("/trending", ArticleController.getTrendingArticles);
router.get("/:id", validateArticleId, ArticleController.getArticleById);

// Protected routes
router.post(
    "/",
    authenticateToken,
    validateArticleCreation,
    ArticleController.createArticle
);
router.put(
    "/:id",
    authenticateToken,
    validateArticleId,
    validateArticleUpdate,
    ArticleController.updateArticle
);
router.delete(
    "/:id",
    authenticateToken,
    validateArticleId,
    ArticleController.deleteArticle
);

// User's articles routes
router.get("/user/me", authenticateToken, ArticleController.getUserArticles);

// Bookmark routes
router.get(
    "/bookmarks/list",
    authenticateToken,
    ArticleController.getSavedArticles
);

router.post(
    "/:id/bookmark",
    authenticateToken,
    validateArticleId,
    ArticleController.saveArticle
);

router.delete(
    "/:id/bookmark",
    authenticateToken,
    validateArticleId,
    ArticleController.unsaveArticle
);

router.get(
    "/:id/bookmark",
    authenticateToken,
    ArticleController.checkSavedStatus
);

export default router;

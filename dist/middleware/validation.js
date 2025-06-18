"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserLogin = exports.validateUserRegistration = exports.validateArticleId = exports.validateArticleUpdate = exports.validateArticleCreation = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: errors
                .array()
                .map((err) => err.msg)
                .join(", "),
        });
    }
    next();
};
exports.validateRequest = validateRequest;
exports.validateArticleCreation = [
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 5, max: 200 })
        .withMessage("Title must be between 5 and 200 characters"),
    (0, express_validator_1.body)("category")
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ max: 50 })
        .withMessage("Category must not exceed 50 characters"),
    (0, express_validator_1.body)("readTime").notEmpty().withMessage("Read time is required"),
    (0, express_validator_1.body)("imageUrl")
        .notEmpty()
        .withMessage("Image URL is required")
        .isURL()
        .withMessage("Image URL must be a valid URL"),
    (0, express_validator_1.body)("content")
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 100 })
        .withMessage("Content must be at least 100 characters"),
    (0, express_validator_1.body)("tags")
        .isArray()
        .withMessage("Tags must be an array")
        .custom((tags) => {
        if (tags.length === 0) {
            throw new Error("At least one tag is required");
        }
        return true;
    }),
    exports.validateRequest,
];
exports.validateArticleUpdate = [
    (0, express_validator_1.body)("title")
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage("Title must be between 5 and 200 characters"),
    (0, express_validator_1.body)("category")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Category must not exceed 50 characters"),
    (0, express_validator_1.body)("imageUrl")
        .optional()
        .isURL()
        .withMessage("Image URL must be a valid URL"),
    (0, express_validator_1.body)("content")
        .optional()
        .isLength({ min: 100 })
        .withMessage("Content must be at least 100 characters"),
    (0, express_validator_1.body)("tags").optional().isArray().withMessage("Tags must be an array"),
    exports.validateRequest,
];
exports.validateArticleId = [
    (0, express_validator_1.param)("id").notEmpty().withMessage("Article ID is required"),
    exports.validateRequest,
];
exports.validateUserRegistration = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Title Is required")
        .isLength({ max: 100 })
        .withMessage("Title must not exceed 100 characters"),
    (0, express_validator_1.body)("avatar")
        .notEmpty()
        .withMessage("Avatar is Required")
        .isURL()
        .withMessage("Avatar must be a valid URL"),
    exports.validateRequest,
];
exports.validateUserLogin = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
    exports.validateRequest,
];
//# sourceMappingURL=validation.js.map
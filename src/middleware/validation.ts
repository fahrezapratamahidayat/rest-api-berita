import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

export const validateRequest = (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    const errors = validationResult(req);
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

export const validateArticleCreation = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 5, max: 200 })
        .withMessage("Title must be between 5 and 200 characters"),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ max: 50 })
        .withMessage("Category must not exceed 50 characters"),

    body("readTime").notEmpty().withMessage("Read time is required"),

    body("imageUrl")
        .notEmpty()
        .withMessage("Image URL is required")
        .isURL()
        .withMessage("Image URL must be a valid URL"),

    body("content")
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 100 })
        .withMessage("Content must be at least 100 characters"),

    body("tags")
        .isArray()
        .withMessage("Tags must be an array")
        .custom((tags) => {
            if (tags.length === 0) {
                throw new Error("At least one tag is required");
            }
            return true;
        }),

    validateRequest,
];

export const validateArticleUpdate = [
    body("title")
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage("Title must be between 5 and 200 characters"),

    body("category")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Category must not exceed 50 characters"),

    body("imageUrl")
        .optional()
        .isURL()
        .withMessage("Image URL must be a valid URL"),

    body("content")
        .optional()
        .isLength({ min: 100 })
        .withMessage("Content must be at least 100 characters"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    validateRequest,
];

export const validateArticleId = [
    param("id").notEmpty().withMessage("Article ID is required"),
    validateRequest,
];

export const validateUserRegistration = [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),

    body("title")
        .notEmpty()
        .withMessage("Title Is required")
        .isLength({ max: 100 })
        .withMessage("Title must not exceed 100 characters"),

    body("avatar")
        .notEmpty()
        .withMessage("Avatar is Required")
        .isURL()
        .withMessage("Avatar must be a valid URL"),

    validateRequest,
];

export const validateUserLogin = [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password").notEmpty().withMessage("Password is required"),

    validateRequest,
];

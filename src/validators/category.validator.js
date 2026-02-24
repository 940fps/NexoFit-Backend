/**
 * @file Middleware de validación para las categorías usando express-validator.
 * @module validators/category.validator
 */

const { body, validationResult } = require('express-validator');

const validateCategoryData = [
    body('title')
        .isString()
        .withMessage('El título debe ser texto')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio y no puede estar vacío'),

    body('slug')
        .isString()
        .withMessage('El slug debe ser texto')
        .trim()
        .notEmpty()
        .withMessage('El slug es obligatorio y no puede estar vacío')
        .matches(/^[a-z0-9-]+$/)
        .withMessage('El slug solo puede contener letras minúsculas, números y guiones (-)'), // ¡Toque pro para URLs!

    body('description')
        .optional()
        .isString()
        .withMessage('La descripción debe ser texto')
        .trim(),

    /*(req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        
        next();
    }*/
];

module.exports = {
    validateCategoryData
};
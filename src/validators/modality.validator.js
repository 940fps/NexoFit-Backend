/**
 * @file Middleware de validación para las modalidades usando express-validator.
 * @module validators/modality.validator
 */

const { body } = require("express-validator");

const validateModalityData = [
  body("title")
    .isString()
    .withMessage("El título debe ser texto")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio y no puede estar vacío")
    .isLength({ max: 100 })
    .withMessage("El título no puede exceder los 100 caracteres"),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .trim(),

  body("image_url")
    .optional()
    .isString()
    .withMessage("La URL de la imagen debe ser texto")
    .trim()
    .isLength({ max: 255 })
    .withMessage("La URL de la imagen no puede exceder los 255 caracteres"),

  body("category_id")
    .notEmpty()
    .withMessage("El ID de la categoría es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El ID de la categoría debe ser un número entero positivo"),
];

module.exports = {
  validateModalityData,
};

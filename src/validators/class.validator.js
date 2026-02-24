/**
 * @file Middleware de validación para los datos de las clases.
 * @module validators/class.validator
 */

const { body } = require("express-validator");

/**
 * Validadores de clases
 * Define reglas de validación para cada endpoint de clases
 */

/**
 * Validación para crear/actualizar clase
 */
const validateClassData = [
  body("modalityId")
    .notEmpty()
    .withMessage("La modalidad es requerida")
    .isInt({ min: 1 })
    .withMessage("La modalidad debe ser un número entero válido"),

  body("instructorId")
    .notEmpty()
    .withMessage("El ID del instructor es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del instructor debe ser un número entero válido"),

  body("startTime")
    .notEmpty()
    .withMessage("La hora de inicio es requerida")
    .isISO8601()
    .withMessage(
      "La hora de inicio debe ser una fecha válida (formato ISO 8601)",
    ),

  body("endTime")
    .notEmpty()
    .withMessage("La hora de fin es requerida")
    .isISO8601()
    .withMessage("La hora de fin debe ser una fecha válida (formato ISO 8601)")
    .custom((value, { req }) => {
      const start = new Date(req.body.startTime);
      const end = new Date(value);
      if (end <= start) {
        throw new Error("La hora de fin debe ser posterior a la de inicio");
      }
      return true;
    }),

  body("capacity")
    .notEmpty()
    .withMessage("La capacidad es requerida")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero mayor que 0"),
];

module.exports = {
  validateClassData,
};
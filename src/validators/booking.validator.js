/**
 * @file Middleware de validación para los datos de las reservas.
 * @module validators/booking.validator
 */

const { body } = require("express-validator");

/**
 * Validación para crear reserva (POST)
 */
const validateBookingData = [
  // classId es opcional en el validador porque ahora aceptamos tanto camelCase como snake_case
  // y la validación real se hace en el controlador
  body("classId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de la clase debe ser un número entero válido"),

  body("class_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de la clase debe ser un número entero válido"),
];

/**
 * Validación para actualizar el estado de una reserva (PUT)
 */
const validateBookingUpdate = [
  body("status")
    .notEmpty()
    .withMessage("El campo status es requerido para actualizar")
    .isIn(["confirmed", "cancelled"])
    .withMessage('El estado debe ser únicamente "confirmed" o "cancelled"'),
];

module.exports = {
  validateBookingData,
  validateBookingUpdate,
};

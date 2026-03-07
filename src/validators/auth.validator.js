const { body, param } = require("express-validator");
const { getMaxAge } = require("../utils/maxage.utils.js");
const { confirmPassword } = require("../utils/confirmpsw.utils.js");

/**
 * Validadores de autenticación
 * Define reglas de validación para cada endpoint de autenticación
 */

/**
 * Validación para registro de usuarios
 */
const registerValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .notEmpty()
    .withMessage("El email es requerido"),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una letra minúscula")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("La contraseña debe contener al menos un carácter especial")
    .notEmpty()
    .withMessage("La contraseña es requerida"),

  body("first_name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("El nombre solo debe contener letras")
    .notEmpty()
    .withMessage("El nombre es requerido"),

  body("last_name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El apellido debe tener entre 2 y 100 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("El apellido solo debe contener letras")
    .notEmpty()
    .withMessage("El apellido es requerido"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage("Número de teléfono inválido")
    .isLength({ min: 8, max: 20 })
    .withMessage("El teléfono debe tener entre 8 y 20 caracteres"),

  body("birth_date")
    .optional()
    .isISO8601()
    .withMessage("Fecha de nacimiento inválida (formato: YYYY-MM-DD)")
    .custom(getMaxAge),

  body("role")
    .optional()
    .isIn(["client", "instructor", "admin"])
    .withMessage("Rol inválido. Debe ser: client, instructor o admin"),
];

/**
 * Validación para inicio de sesión
 */
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .notEmpty()
    .withMessage("El email es requerido"),

  body("password").trim().notEmpty().withMessage("La contraseña es requerida"),
];

/**
 * Validación para refrescar token
 */
const refreshTokenValidation = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("El refresh token es requerido")
    .isJWT()
    .withMessage("Refresh token inválido"),
];

/**
 * Validación para actualizar perfil
 */
const updateProfileValidation = [
  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("El nombre solo debe contener letras"),

  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El apellido debe tener entre 2 y 100 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("El apellido solo debe contener letras"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage("Número de teléfono inválido")
    .isLength({ min: 8, max: 20 })
    .withMessage("El teléfono debe tener entre 8 y 20 caracteres"),

  body("birth_date")
    .optional()
    .isISO8601()
    .withMessage("Fecha de nacimiento inválida (formato: YYYY-MM-DD)")
    .custom(getMaxAge),

  body("weight")
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage("El peso debe estar entre 20 y 500 kg"),

  body("height")
    .optional()
    .isFloat({ min: 50, max: 300 })
    .withMessage("La altura debe estar entre 50 y 300 cm"),

  body("image_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL de imagen inválida"),
];

/**
 * Validación para cambiar contraseña
 */
const changePasswordValidation = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("La contraseña actual es requerida"),

  body("newPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("La nueva contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage(
      "La nueva contraseña debe contener al menos una letra mayúscula",
    )
    .matches(/[a-z]/)
    .withMessage(
      "La nueva contraseña debe contener al menos una letra minúscula",
    )
    .matches(/\d/)
    .withMessage("La nueva contraseña debe contener al menos un número")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "La nueva contraseña debe contener al menos un carácter especial",
    )
    .notEmpty()
    .withMessage("La nueva contraseña es requerida")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("La nueva contraseña debe ser diferente a la actual");
      }
      return true;
    }),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("La confirmación de contraseña es requerida")
    .custom((value, { req }) => {
      confirmPassword(value, req.body.newPassword);
    }),
];

/**
 * Validación para recuperar contraseña
 */
const forgotPasswordValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail()
    .notEmpty()
    .withMessage("El email es requerido"),
];

/**
 * Validación para verificar email
 */
const checkEmailValidation = [
  param("email")
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
];

module.exports = {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  updateProfileValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  checkEmailValidation,
};

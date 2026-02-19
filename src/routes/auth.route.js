const express = require("express");
const router = express.Router();

// Importar controlador
const authController = require("../controllers/auth.controller");

// Importar validadores
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  updateProfileValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  checkEmailValidation,
} = require("../validators/auth.validator");

// Importar middleware
const { authenticate } = require("../middlewares/auth.middleware");
const { handleValidationErrors } = require("../middlewares/errorHandler");

/**
 * Rutas públicas (no requieren autenticación)
 */

// POST /api/auth/register - Registrar nuevo usuario
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  authController.register,
);

// POST /api/auth/login - Iniciar sesión
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authController.login,
);

// POST /api/auth/refresh - Refrescar token de acceso
router.post(
  "/refresh",
  refreshTokenValidation,
  handleValidationErrors,
  authController.refreshToken,
);

// POST /api/auth/forgot-password - Solicitar restablecimiento de contraseña
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  handleValidationErrors,
  authController.forgotPassword,
);

// GET /api/auth/check-email/:email - Verificar disponibilidad de email
router.get(
  "/check-email/:email",
  checkEmailValidation,
  handleValidationErrors,
  authController.checkEmail,
);

/**
 * Rutas protegidas (requieren autenticación)
 */

// GET /api/auth/me - Verificar token y obtener info básica del usuario
router.get("/me", authenticate, authController.me);

// GET /api/auth/profile - Obtener perfil completo del usuario autenticado
router.get("/profile", authenticate, authController.getProfile);

// PUT /api/auth/profile - Actualizar perfil del usuario autenticado
router.put(
  "/profile",
  authenticate,
  updateProfileValidation,
  handleValidationErrors,
  authController.updateProfile,
);

// POST /api/auth/change-password - Cambiar contraseña
router.post(
  "/change-password",
  authenticate,
  changePasswordValidation,
  handleValidationErrors,
  authController.changePassword,
);

// POST /api/auth/logout - Cerrar sesión
router.post("/logout", authenticate, authController.logout);

module.exports = router;
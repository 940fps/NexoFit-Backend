const { validationResult } = require("express-validator");

/**
 * Middleware para manejar errores de validación
 * Debe usarse después de los validadores de express-validator
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array().map((error) => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value,
      })),
    });
  }

  next();
};

/**
 * Middleware global para manejo de errores
 * Debe ir al final de todas las rutas
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Error de validación de base de datos
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "El recurso ya existe",
      error: err.sqlMessage,
    });
  }

  // Error de base de datos
  if (err.code && err.code.startsWith("ER_")) {
    return res.status(500).json({
      success: false,
      message: "Error en la base de datos",
      error:
        process.env.NODE_ENV === "development" ? err.sqlMessage : undefined,
    });
  }

  // Error personalizado con status
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message || "Error en la petición",
    });
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

/**
 * Middleware para rutas no encontradas
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
};

module.exports = {
  handleValidationErrors,
  errorHandler,
  notFound,
};

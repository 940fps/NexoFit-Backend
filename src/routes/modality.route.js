/**
 * @file Rutas (Endpoints) de la API para la gestión de modalidades.
 * @module routes/modality.route
 */

const express = require("express");
const router = express.Router();
const modalityController = require("../controllers/modality.controller");
const modalityValidator = require("../validators/modality.validator");
const { handleValidationErrors } = require("../middlewares/errorHandler");

// Obtener todas las modalidades
// GET: http://localhost:8080/modalities
router.get("/", modalityController.getAllModalities);

// Buscar modalidades por texto
// GET: http://localhost:8080/modalities/search?q=yoga&limit=10
router.get("/search", modalityController.searchModalities);

// Obtener una modalidad con todas sus clases
// GET: http://localhost:8080/modalities/:id/with-classes
router.get("/:id/with-classes", modalityController.getModalityWithClasses);

// Obtener una modalidad específica por su ID
// GET: http://localhost:8080/modalities/:id
router.get("/:id", modalityController.getModalityById);

// Crear una nueva modalidad
// POST: http://localhost:8080/modalities
router.post(
  "/",
  modalityValidator.validateModalityData,
  handleValidationErrors,
  modalityController.createModality,
);

// Actualizar una modalidad existente
// PUT: http://localhost:8080/modalities/:id
router.put(
  "/:id",
  modalityValidator.validateModalityData,
  handleValidationErrors,
  modalityController.updateModality,
);

// Eliminar una modalidad
// DELETE: http://localhost:8080/modalities/:id
router.delete("/:id", modalityController.deleteModality);

module.exports = router;

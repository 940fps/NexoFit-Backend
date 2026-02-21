/**
 * @file Rutas (Endpoints) de la API para la gestión de clases.
 * @module route/class
 */

const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const classValidator = require('../validators/class.validator');

// Obtener todas las clases
// GET: http://localhost:8080/classes
router.get('/', classController.getAllClasses);

// Obtener una clase específica por su ID
// GET: http://localhost:8080/classes/:id
router.get('/:id', classController.getClassById);

// Crear una nueva clase
// POST: http://localhost:8080/classes
router.post('/', classValidator.validateClassData, classController.createClass);

// Actualizar una clase existente
// PUT: http://localhost:8080/classes/:id
router.put('/:id', classValidator.validateClassData, classController.updateClass);

// Eliminar una clase
// DELETE: http://localhost:8080/classes/:id
router.delete('/:id', classController.deleteClass);

module.exports = router;
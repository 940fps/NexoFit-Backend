/**
 * @file Rutas (Endpoints) de la API para la gestión de reservas.
 * @module route/booking
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const bookingValidator = require('../validators/booking.validator');

router.get('/', bookingController.getAllBookings);

router.get('/:id', bookingController.getBookingById);

router.post('/', bookingValidator.validateBookingData, bookingController.createBooking);

router.put('/:id', bookingValidator.validateBookingUpdate, bookingController.updateBooking);

router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
/**
 * @file Rutas (Endpoints) de la API para la gestión de reservas.
 * @module route/booking
 */

const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const bookingValidator = require("../validators/booking.validator");
const { authenticate } = require("../middlewares/auth.middleware");

// Todas las rutas de bookings requieren autenticación
router.use(authenticate);

// Obtener próximas clases reservadas del usuario
router.get("/my-upcoming", bookingController.getMyUpcomingBookings);

router.get("/", bookingController.getAllBookings);

router.get("/:id", bookingController.getBookingById);

router.post(
  "/",
  bookingValidator.validateBookingData,
  bookingController.createBooking,
);

router.put(
  "/:id",
  bookingValidator.validateBookingUpdate,
  bookingController.updateBooking,
);

router.delete("/:id", bookingController.deleteBooking);

module.exports = router;

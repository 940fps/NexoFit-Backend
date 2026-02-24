/**
 * @file Controlador que gestiona las peticiones HTTP para las reservas (bookings).
 * @module controllers/booking.controller
 */

const bookingService = require('../services/booking.service');
const classService = require('../services/class'); 

async function getAllBookings(req, res) {
    try {
        const bookings = await bookingService.findAllBookings(req.query.userId, req.query.classId);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
}

async function getBookingById(req, res) {
    try {
        const bookingData = await bookingService.findBooking(req.params.id);
        if (!bookingData) {
            return res.status(404).json({ error: 'La reserva solicitada no existe' });
        }
        res.status(200).json(bookingData);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la reserva' });
    }
}

async function createBooking(req, res) {
    try {
        const { userId, classId } = req.body;
    
        const bookingConflict = await bookingService.findBookingByUserAndClass(userId, classId);
        if (bookingConflict) {
            return res.status(400).json({ error: 'El usuario ya tiene una reserva para esta clase' });
        }

        const classData = await classService.findClass(classId);
        if (!classData) {
            return res.status(404).json({ error: 'La clase que intentas reservar no existe' });
        }

        const currentBookings = await bookingService.countActiveBookingsByClass(classId);
        if (currentBookings >= classData.capacity) {
            return res.status(400).json({ error: 'Lo sentimos, la clase ya está llena' });
        }

        const newBooking = await bookingService.addBooking(userId, classId);
        res.status(201).json(newBooking); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
}

async function updateBooking(req, res) {
    try {
        const { status } = req.body;
        const updatedBooking = await bookingService.modifyBookingStatus(req.params.id, status);
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
}

async function deleteBooking(req, res) {
    try {
        await bookingService.removeBooking(req.params.id);
        res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
}

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};
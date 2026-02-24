/**
 * @file Middleware de validación para los datos de las reservas.
 * @module validators/booking.validator
 */

function validateBookingData(req, res, next) {
    const { userId, classId } = req.body;

    if (!userId || !classId) {
        return res.status(400).json({ error: 'Faltan campos obligatorios por rellenar (userId, classId)' });
    }

    if (typeof userId !== 'number') {
        return res.status(400).json({ error: 'El ID del usuario debe ser un número' });
    }
    if (typeof classId !== 'number') {
        return res.status(400).json({ error: 'El ID de la clase debe ser un número' });
    }

    next();
}

function validateBookingUpdate(req, res, next) {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'El campo status es obligatorio para actualizar' });
    }

    const validStatuses = ['confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'El estado debe ser únicamente "confirmed" o "cancelled"' });
    }

    next();
}

module.exports = {
    validateBookingData,
    validateBookingUpdate
};
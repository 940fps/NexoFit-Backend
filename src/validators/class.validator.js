/**
 * @file Middleware de validación para los datos de las clases.
 * @module validators/class.validator
 */

function validateClassData(req, res, next) {
    const { modalityId, instructorId, startTime, endTime, capacity } = req.body;

    if (!modalityId || !instructorId || !startTime || !endTime || !capacity) {
        return res.status(400).json({ error: 'Faltan campos obligatorios por rellenar' });
    }

    if (typeof modalityId !== 'number') {
        return res.status(400).json({ error: 'La modalidad debe ser un número' });
    }
    if (typeof instructorId !== 'number') {
        return res.status(400).json({ error: 'El ID del instructor debe ser un número' });
    }
    if (typeof capacity !== 'number') {
        return res.status(400).json({ error: 'La capacidad de la clase debe ser un número' });
    }

    if (capacity <= 0) {
        return res.status(400).json({ error: 'La capacidad de la clase debe ser mayor que 0' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
        return res.status(400).json({ error: 'La hora de fin debe ser posterior a la de inicio' });
    }

    next();
}

module.exports = {
    validateClassData
};
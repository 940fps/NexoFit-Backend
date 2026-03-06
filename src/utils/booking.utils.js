/**
 * @file Utilidades para la lógica de negocio de las reservas.
 * @module utils/booking.utils
 */

/**
 * Calcula el porcentaje de ocupación de una clase.
 * @param {number} currentBookings - Número de reservas actuales confirmadas.
 * @param {number} capacity - Capacidad máxima de la clase.
 * @returns {number} Porcentaje de ocupación (0-100), redondeado a 2 decimales.
 */
function calculateOccupancyPercentage(currentBookings, capacity) {
    if (!capacity || capacity <= 0) return 0;
    const percentage = (currentBookings / capacity) * 100;
    return Math.min(Math.round(percentage * 100) / 100, 100);
}

module.exports = {
    calculateOccupancyPercentage,
};

/**
 * @file Utilidades para la lógica de negocio de las clases.
 * @module utils/class.utils
 */

/**
 * Verifica que el horario de fin sea posterior al de inicio.
 * @param {string|Date} startTime - Fecha/hora de inicio.
 * @param {string|Date} endTime - Fecha/hora de fin.
 * @returns {boolean} true si el rango es válido.
 */
function isValidTimeRange(startTime, endTime) {
    return new Date(endTime) > new Date(startTime);
}

/**
 * Calcula la duración de una clase en minutos.
 * @param {string|Date} startTime - Fecha/hora de inicio.
 * @param {string|Date} endTime - Fecha/hora de fin.
 * @returns {number} Duración en minutos.
 */
function calculateClassDuration(startTime, endTime) {
    const diffMs = new Date(endTime) - new Date(startTime);
    return Math.round(diffMs / (1000 * 60));
}

/**
 * Valida que la capacidad de una clase esté dentro del rango permitido.
 * @param {number} capacity - Capacidad a validar.
 * @param {number} [min=1] - Mínimo permitido.
 * @param {number} [max=50] - Máximo permitido.
 * @returns {boolean} true si la capacidad es válida.
 */
function isValidCapacity(capacity, min = 1, max = 50) {
    const num = Number(capacity);
    return Number.isInteger(num) && num >= min && num <= max;
}

module.exports = {
    isValidTimeRange,
    calculateClassDuration,
    isValidCapacity,
};

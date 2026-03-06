/**
 * @file Utilidades para la lógica de negocio de autenticación y usuarios.
 * @module utils/auth.utils
 */

/**
 * Verifica que el usuario tenga al menos la edad mínima requerida.
 * @param {string|Date} birthDate - Fecha de nacimiento del usuario.
 * @param {number} [minAge=16] - Edad mínima requerida (por defecto 16).
 * @returns {boolean} true si el usuario cumple la edad mínima.
 */
function validateMinimumAge(birthDate, minAge = 16) {
    const minAgeDate = new Date(birthDate);
    minAgeDate.setFullYear(minAgeDate.getFullYear() + minAge);
    return new Date() >= minAgeDate;
}

module.exports = {
    validateMinimumAge,
};

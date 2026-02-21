/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'classes'.
 * @module services/class
 */

const { db } = require('../config/database'); 

/**
 * Obtiene todas las clases registradas en el gimnasio.
 * @param {number} [modalityId] - (Opcional) ID de la modalidad para filtrar las clases.
 * @param {string} [search] - (Opcional) Término de búsqueda para filtrar por nombre de modalidad.

 * @returns {Promise<Array>} Lista de todas las clases.
 */
async function findAllClasses(modalityId, search) {
  
  const query = db('classes')
    .join('modalities', 'classes.modality_id', 'modalities.id')
    .select('classes.*', 'modalities.title as modality_name');

 
  if (modalityId) query.where('classes.modality_id', modalityId);
  if (search) query.where('modalities.title', 'like', `%${search}%`);

  
  return query; 
}

/**
 * Verifica si una clase existe en la base de datos por su ID.
 * @param {number} id - El ID de la clase a verificar.
 * @returns {Promise<boolean>} Retorna true si existe, false si no.
 */
async function classExistsById(id) {
  const result = await db('classes').where('id', id).first();
  return !!result;
}

/**
 * Busca si un instructor ya tiene una clase programada a una hora específica.
 * @param {number} instructorId - El ID del profesor.
 * @param {string|Date} startTime - La fecha y hora de inicio de la clase.
 * @returns {Promise<Object|undefined>} Retorna la clase si hay conflicto, o undefined si está libre.
 */
async function findClassByInstructorAndTime(instructorId, startTime) {
  return await db('classes')
    .where('instructor_id', instructorId)
    .where('start_time', startTime)
    .first();
}

/**
 * Inserta una nueva clase en la base de datos.
 * @param {number} modalityId - ID de la actividad (ej. Spinning).
 * @param {number} instructorId - ID del profesor que imparte la clase.
 * @param {string} startTime - Fecha y hora de inicio.
 * @param {string} endTime - Fecha y hora de fin.
 * @param {number} capacity - Capacidad máxima de alumnos.
 * @returns {Promise<Object>} El objeto de la clase recién creada.
 */
async function addClass(modalityId, instructorId, startTime, endTime, capacity) {
  const [id] = await db('classes').insert({
    modality_id: modalityId,
    instructor_id: instructorId,
    start_time: startTime,
    end_time: endTime,
    capacity: capacity
  });

  return { id, modality_id: modalityId, instructor_id: instructorId, start_time: startTime, end_time: endTime, capacity };
}

/**
 * Actualiza los datos de una clase existente.
 * @param {number} id - ID de la clase a modificar.
 * @returns {Promise<Object>} El objeto de la clase actualizada.
 */
async function modifyClass(id, modalityId, instructorId, startTime, endTime, capacity) {
  await db('classes').where('id', id).update({
    modality_id: modalityId,
    instructor_id: instructorId,
    start_time: startTime,
    end_time: endTime,
    capacity: capacity
  });

  return { id, modality_id: modalityId, instructor_id: instructorId, start_time: startTime, end_time: endTime, capacity };
}

/**
 * Elimina una clase de forma definitiva de la base de datos.
 * @param {number} id - ID de la clase a eliminar.
 * @returns {Promise<void>}
 */
async function removeClass(id) {
  await db('classes').where('id', id).del();
}

/**
 * Busca y devuelve los datos completos de una clase específica.
 * @param {number} id - ID de la clase.
 * @returns {Promise<Object|undefined>} Los datos de la clase o undefined si no se encuentra.
 */
async function findClass(id) {
  return await db('classes').where('id', id).first();
}

module.exports = {
  findAllClasses,
  classExistsById,
  findClassByInstructorAndTime,
  addClass,
  modifyClass,
  removeClass,
  findClass
};
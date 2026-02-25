/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'modalities'.
 * @module services/modality.service
 */

const { db } = require("../config/database");

/**
 * Obtiene todas las modalidades de la base de datos con información de su categoría.
 * @returns {Promise<Array>} Lista de modalidades.
 */
async function findAllModalities() {
  return await db("modalities")
    .select(
      "modalities.*",
      "category.title as category_title",
      "category.slug as category_slug",
    )
    .leftJoin("category", "modalities.category_id", "category.id");
}

/**
 * Busca una modalidad por su ID.
 * @param {number} id - ID de la modalidad.
 * @returns {Promise<Object|undefined>} La modalidad o undefined si no existe.
 */
async function findModalityById(id) {
  return await db("modalities")
    .select(
      "modalities.*",
      "category.title as category_title",
      "category.slug as category_slug",
    )
    .leftJoin("category", "modalities.category_id", "category.id")
    .where("modalities.id", id)
    .first();
}

/**
 * Inserta una nueva modalidad en la base de datos.
 * @param {string} title - Título de la modalidad.
 * @param {string} description - Descripción detallada.
 * @param {string} image_url - URL de la imagen de la modalidad.
 * @param {number} category_id - ID de la categoría a la que pertenece.
 * @returns {Promise<Object>} El objeto de la modalidad recién creada.
 */
async function addModality(title, description, image_url, category_id) {
  const [id] = await db("modalities").insert({
    title,
    description,
    image_url,
    category_id,
  });

  return { id, title, description, image_url, category_id };
}

/**
 * Actualiza los datos de una modalidad existente.
 * @param {number} id - ID de la modalidad a modificar.
 * @param {string} title - Nuevo título.
 * @param {string} description - Nueva descripción.
 * @param {string} image_url - Nueva URL de imagen.
 * @param {number} category_id - Nuevo ID de categoría.
 * @returns {Promise<Object>} El objeto de la modalidad actualizada.
 */
async function modifyModality(id, title, description, image_url, category_id) {
  await db("modalities").where("id", id).update({
    title,
    description,
    image_url,
    category_id,
  });

  return { id, title, description, image_url, category_id };
}

/**
 * Elimina una modalidad de la base de datos.
 * @param {number} id - ID de la modalidad a eliminar.
 * @returns {Promise<void>}
 */
async function removeModality(id) {
  await db("modalities").where("id", id).del();
}

module.exports = {
  findAllModalities,
  findModalityById,
  addModality,
  modifyModality,
  removeModality,
};

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

/**
 * Obtiene una modalidad con todas sus clases (incluyendo información del instructor y disponibilidad).
 * @param {number} id - ID de la modalidad.
 * @returns {Promise<Object|null>} La modalidad con sus clases o null si no existe.
 */
async function findModalityWithClasses(id) {
  // Obtener la modalidad
  const modality = await db("modalities").where("id", id).first();

  if (!modality) {
    return null;
  }

  // Obtener todas las clases de esta modalidad con información del instructor
  const classes = await db("classes")
    .where("classes.modality_id", id)
    .leftJoin("users", "classes.instructor_id", "users.id")
    .select(
      "classes.id",
      "classes.start_time",
      "classes.end_time",
      "classes.capacity",
      "users.first_name as instructor_first_name",
      "users.last_name as instructor_last_name",
    )
    .orderBy("classes.start_time", "asc");

  // Para cada clase, obtener el número de reservas confirmadas
  for (let classItem of classes) {
    const bookingsCount = await db("bookings")
      .where("class_id", classItem.id)
      .where("status", "confirmed")
      .count("id as count")
      .first();

    classItem.current_bookings = bookingsCount.count;
    classItem.is_full = classItem.current_bookings >= classItem.capacity;
  }

  modality.classes = classes;
  return modality;
}

/**
 * Busca modalidades por texto (título o descripción).
 * @param {string} searchTerm - Término de búsqueda.
 * @param {number} limit - Límite de resultados (default: 10).
 * @returns {Promise<Array>} Lista de modalidades que coinciden con la búsqueda.
 */
async function searchModalities(searchTerm, limit = 10) {
  const term = `%${searchTerm}%`;

  return await db("modalities")
    .select(
      "modalities.id",
      "modalities.title",
      "modalities.description",
      "modalities.image_url",
      "category.title as category_title",
    )
    .leftJoin("category", "modalities.category_id", "category.id")
    .where(function () {
      this.where("modalities.title", "like", term).orWhere(
        "modalities.description",
        "like",
        term,
      );
    })
    .limit(limit);
}

module.exports = {
  findAllModalities,
  findModalityById,
  addModality,
  modifyModality,
  removeModality,
  findModalityWithClasses,
  searchModalities,
};

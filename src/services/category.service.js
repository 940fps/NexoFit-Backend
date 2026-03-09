/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'categories'.
 * @module services/category
 */

const { db } = require("../config/database");

/**
 * Obtiene todas las categorías de la base de datos.
 * @returns {Promise<Array>} Lista de categorías.
 */
async function findAllCategories() {
  return await db("category").select("*");
}

/**
 * Busca una categoría por su ID.
 * @param {number} id - ID de la categoría.
 * @returns {Promise<Object|undefined>} La categoría o undefined si no existe.
 */
async function findCategoryById(id) {
  return await db("category").where("id", id).first();
}

/**
 * Busca si ya existe una categoría con un slug específico (el slug debe ser único).
 * @param {string} slug - El slug a buscar.
 * @returns {Promise<Object|undefined>} La categoría si existe el slug.
 */
async function findCategoryBySlug(slug) {
  return await db("category").where("slug", slug).first();
}

/**
 * Inserta una nueva categoría en la base de datos.
 * @param {string} title - Título de la categoría.
 * @param {string} description - Descripción detallada.
 * @param {string} slug - Identificador único para URLs.
 * @returns {Promise<Object>} El objeto de la categoría recién creada.
 */
async function addCategory(title, description, slug) {
  const [id] = await db("category").insert({
    title,
    description,
    slug,
  });

  return { id, title, description, slug };
}

/**
 * Actualiza los datos de una categoría existente.
 * @param {number} id - ID de la categoría a modificar.
 * @param {string} title - Nuevo título.
 * @param {string} description - Nueva descripción.
 * @param {string} slug - Nuevo slug.
 * @returns {Promise<Object>} El objeto de la categoría actualizada.
 */
async function modifyCategory(id, title, description, slug) {
  await db("category").where("id", id).update({
    title,
    description,
    slug,
  });

  return { id, title, description, slug };
}

/**
 * Elimina una categoría de la base de datos.
 * @param {number} id - ID de la categoría a eliminar.
 * @returns {Promise<void>}
 */
async function removeCategory(id) {
  await db("category").where("id", id).del();
}

/**
 * Obtiene todas las categorías con sus primeras 3 modalidades.
 * @returns {Promise<Array>} Lista de categorías con sus modalidades.
 */
async function findCategoriesWithModalities() {
  // Obtener todas las categorías
  const categories = await db("category").select("*").orderBy("id", "asc");

  // Para cada categoría, obtener TODAS sus modalidades (sin límite)
  for (let category of categories) {
    const modalities = await db("modalities")
      .where("category_id", category.id)
      .select("id", "title", "description", "image_url")
      .orderBy("id", "asc");

    category.modalities = modalities;
  }

  return categories;
}

module.exports = {
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  addCategory,
  modifyCategory,
  removeCategory,
  findCategoriesWithModalities,
};

/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'classes'.
 * @module services/class
 */

const { db } = require("../config/database");

/**
 * Converts ISO 8601 date string to MySQL DATETIME format.
 * @param {string} isoString - ISO 8601 date string (e.g., "2026-03-09T01:47:00.000Z")
 * @returns {string} MySQL DATETIME format (e.g., "2026-03-09 01:47:00")
 */
function formatDateForMySQL(isoString) {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

/**
 * Obtiene todas las clases registradas en el gimnasio con información completa.
 * @param {number} [modalityId] - (Opcional) ID de la modalidad para filtrar las clases.
 * @param {string} [search] - (Opcional) Término de búsqueda para filtrar por nombre de modalidad.
 * @param {number} [userId] - (Opcional) ID del usuario autenticado para incluir isBooked e isFull.
 * @param {boolean} [futureOnly] - (Opcional) Si es true, solo devuelve clases futuras.
 * @returns {Promise<Array>} Lista de todas las clases con información completa.
 */
async function findAllClasses(
  modalityId,
  search,
  userId = null,
  futureOnly = false,
) {
  const query = db("classes")
    .join("modalities", "classes.modality_id", "modalities.id")
    .join("category", "modalities.category_id", "category.id")
    .join("users as instructors", "classes.instructor_id", "instructors.id")
    .leftJoin("bookings", function () {
      this.on("bookings.class_id", "=", "classes.id").andOn(
        "bookings.status",
        "=",
        db.raw("?", ["confirmed"]),
      );
    })
    .select(
      "classes.id",
      "classes.modality_id",
      "classes.instructor_id",
      "classes.start_time",
      "classes.end_time",
      "classes.capacity",
      "modalities.title as modality_name",
      "modalities.description as modality_description",
      "modalities.image_url as modality_image",
      "category.title as category_name",
      "category.slug as category_slug",
      db.raw(
        "CONCAT(instructors.first_name, ' ', instructors.last_name) as instructor_name",
      ),
      "instructors.image_url as instructor_image",
      db.raw("COUNT(DISTINCT bookings.id) as current_bookings"),
    )
    .groupBy(
      "classes.id",
      "classes.modality_id",
      "classes.instructor_id",
      "classes.start_time",
      "classes.end_time",
      "classes.capacity",
      "modalities.title",
      "modalities.description",
      "modalities.image_url",
      "category.title",
      "category.slug",
      "instructors.first_name",
      "instructors.last_name",
      "instructors.image_url",
    );

  if (modalityId) query.where("classes.modality_id", modalityId);
  if (search) query.where("modalities.title", "like", `%${search}%`);
  if (futureOnly) {
    query.where("classes.start_time", ">", db.fn.now());
    console.log("[findAllClasses] Filtering for future classes only");
  }

  const classes = await query;

  console.log("[findAllClasses] Total classes found:", classes.length);
  if (classes.length > 0) {
    console.log(
      "[findAllClasses] Sample class dates:",
      classes.slice(0, 3).map((c) => ({
        id: c.id,
        start_time: c.start_time,
        modality: c.modality_name,
      })),
    );
  }

  // Si hay usuario autenticado, añadir isBooked e isFull
  if (userId) {
    // Obtener todas las reservas del usuario para estas clases
    const classIds = classes.map((c) => c.id);
    const userBookings = await db("bookings")
      .whereIn("class_id", classIds)
      .where("user_id", userId)
      .where("status", "confirmed")
      .select("class_id");

    const bookedClassIds = new Set(userBookings.map((b) => b.class_id));

    return classes.map((cls) => ({
      ...cls,
      isBooked: bookedClassIds.has(cls.id),
      isFull: parseInt(cls.current_bookings) >= cls.capacity,
    }));
  }

  return classes;
}

/**
 * Verifica si una clase existe en la base de datos por su ID.
 * @param {number} id - El ID de la clase a verificar.
 * @returns {Promise<boolean>} Retorna true si existe, false si no.
 */
async function classExistsById(id) {
  const result = await db("classes").where("classes.id", id).first();
  return !!result;
}

/**
 * Busca si un instructor ya tiene una clase programada a una hora específica.
 * @param {number} instructorId - El ID del profesor.
 * @param {string|Date} startTime - La fecha y hora de inicio de la clase.
 * @returns {Promise<Object|undefined>} Retorna la clase si hay conflicto, o undefined si está libre.
 */
async function findClassByInstructorAndTime(instructorId, startTime) {
  const formattedStartTime = formatDateForMySQL(startTime);

  return await db("classes")
    .where("classes.instructor_id", instructorId)
    .where("classes.start_time", formattedStartTime)
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
async function addClass(
  modalityId,
  instructorId,
  startTime,
  endTime,
  capacity,
) {
  const formattedStartTime = formatDateForMySQL(startTime);
  const formattedEndTime = formatDateForMySQL(endTime);

  console.log("[addClass] Original times:", { startTime, endTime });
  console.log("[addClass] Formatted times:", {
    formattedStartTime,
    formattedEndTime,
  });

  const [id] = await db("classes").insert({
    modality_id: modalityId,
    instructor_id: instructorId,
    start_time: formattedStartTime,
    end_time: formattedEndTime,
    capacity: capacity,
  });

  return {
    id,
    modality_id: modalityId,
    instructor_id: instructorId,
    start_time: formattedStartTime,
    end_time: formattedEndTime,
    capacity,
  };
}

/**
 * Actualiza los datos de una clase existente.
 * @param {number} id - ID de la clase a modificar.
 * @returns {Promise<Object>} El objeto de la clase actualizada.
 */
async function modifyClass(
  id,
  modalityId,
  instructorId,
  startTime,
  endTime,
  capacity,
) {
  const formattedStartTime = formatDateForMySQL(startTime);
  const formattedEndTime = formatDateForMySQL(endTime);

  await db("classes").where("id", id).update({
    modality_id: modalityId,
    instructor_id: instructorId,
    start_time: formattedStartTime,
    end_time: formattedEndTime,
    capacity: capacity,
  });

  return {
    id,
    modality_id: modalityId,
    instructor_id: instructorId,
    start_time: formattedStartTime,
    end_time: formattedEndTime,
    capacity,
  };
}

/**
 * Cuenta las reservas asociadas a una clase.
 * @param {number} classId - ID de la clase.
 * @returns {Promise<number>} Número de reservas activas.
 */
async function countBookingsByClass(classId) {
  const result = await db("bookings")
    .where("class_id", classId)
    .count("id as total")
    .first();
  return result.total;
}

/**
 * Elimina una clase de forma definitiva de la base de datos.
 * @param {number} id - ID de la clase a eliminar.
 * @returns {Promise<void>}
 */
async function removeClass(id) {
  await db("classes").where("id", id).del();
}

/**
 * Busca y devuelve los datos completos de una clase específica.
 * @param {number} id - ID de la clase.
 * @returns {Promise<Object|undefined>} Los datos de la clase o undefined si no se encuentra.
 */
async function findClass(id) {
  return await db("classes").where("classes.id", id).first();
}

/**
 * Obtiene las clases de un instructor específico con número de reservas.
 * @param {number} instructorId - ID del instructor.
 * @returns {Promise<Array>} Lista de clases del instructor con información de reservas.
 */
async function findClassesByInstructor(instructorId) {
  return db("classes")
    .join("modalities", "classes.modality_id", "modalities.id")
    .join("category", "modalities.category_id", "category.id")
    .leftJoin("bookings", function () {
      this.on("bookings.class_id", "=", "classes.id").andOn(
        "bookings.status",
        "=",
        db.raw("?", ["confirmed"]),
      );
    })
    .where("classes.instructor_id", instructorId)
    .select(
      "classes.id",
      "classes.modality_id",
      "classes.start_time",
      "classes.end_time",
      "classes.capacity",
      "modalities.title as modality_name",
      "modalities.image_url as modality_image",
      "category.title as category_name",
      db.raw("COUNT(DISTINCT bookings.id) as current_bookings"),
    )
    .groupBy(
      "classes.id",
      "classes.modality_id",
      "classes.start_time",
      "classes.end_time",
      "classes.capacity",
      "modalities.title",
      "modalities.image_url",
      "category.title",
    )
    .orderBy("classes.start_time", "asc");
}

module.exports = {
  findAllClasses,
  classExistsById,
  findClassByInstructorAndTime,
  addClass,
  modifyClass,
  removeClass,
  findClass,
  countBookingsByClass,
  findClassesByInstructor,
};

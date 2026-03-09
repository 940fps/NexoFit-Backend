/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'bookings'.
 * @module services/booking
 */

const { db } = require("../config/database");

async function findAllBookings(userId, classId) {
  const query = db("bookings")
    .join("users", "bookings.user_id", "users.id")
    .join("classes", "bookings.class_id", "classes.id")
    .select(
      "bookings.*",
      "users.first_name",
      "users.last_name",
      "classes.start_time",
    );

  if (userId) query.where("bookings.user_id", userId);
  if (classId) query.where("bookings.class_id", classId);

  return query;
}

async function findBookingByUserAndClass(userId, classId) {
  return await db("bookings")
    .where("bookings.user_id", userId)
    .where("bookings.class_id", classId)
    .first();
}

async function countActiveBookingsByClass(classId) {
  const result = await db("bookings")
    .where("bookings.class_id", classId)
    .where("bookings.status", "confirmed")
    .count("id as total")
    .first();

  return parseInt(result.total || 0, 10);
}

async function addBooking(userId, classId) {
  const [id] = await db("bookings").insert({
    user_id: userId,
    class_id: classId,
  });
  return { id, user_id: userId, class_id: classId, status: "confirmed" };
}

async function modifyBookingStatus(id, status) {
  await db("bookings").where("bookings.id", id).update({ status: status });
  return { id, status };
}

async function removeBooking(id) {
  await db("bookings").where("bookings.id", id).del();
}

async function findBooking(id) {
  return await db("bookings").where("bookings.id", id).first();
}

/**
 * Obtiene las próximas clases reservadas del usuario (que no han pasado)
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Lista de próximas clases con toda la información
 */
async function findUpcomingBookings(userId) {
  console.log("[findUpcomingBookings] userId:", userId);

  // Primero, obtener todos los bookings del usuario sin filtro de fecha
  const allBookings = await db("bookings")
    .join("classes", "bookings.class_id", "classes.id")
    .where("bookings.user_id", userId)
    .where("bookings.status", "confirmed")
    .select(
      "bookings.id as booking_id",
      "classes.id as class_id",
      "classes.start_time",
      db.raw("NOW() as now_time"),
    );

  console.log("[findUpcomingBookings] All confirmed bookings:", allBookings);

  // Ahora obtener solo los futuros
  const result = await db("bookings")
    .join("classes", "bookings.class_id", "classes.id")
    .join("modalities", "classes.modality_id", "modalities.id")
    .join("category", "modalities.category_id", "category.id")
    .join("users as instructors", "classes.instructor_id", "instructors.id")
    .where("bookings.user_id", userId)
    .where("bookings.status", "confirmed")
    .where("classes.start_time", ">", db.fn.now())
    .select(
      "bookings.id as booking_id",
      "classes.id as class_id",
      "classes.start_time",
      "classes.end_time",
      "classes.capacity",
      "modalities.title as modality_name",
      "modalities.image_url as modality_image",
      "category.title as category_name",
      db.raw(
        "CONCAT(instructors.first_name, ' ', instructors.last_name) as instructor_name",
      ),
    )
    .orderBy("classes.start_time", "asc");

  console.log(
    "[findUpcomingBookings] Upcoming bookings (after date filter):",
    result,
  );

  return result;
}

module.exports = {
  findAllBookings,
  findBookingByUserAndClass,
  countActiveBookingsByClass,
  addBooking,
  modifyBookingStatus,
  removeBooking,
  findBooking,
  findUpcomingBookings,
};

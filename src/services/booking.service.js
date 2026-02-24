/**
 * @file Servicio que gestiona las consultas SQL de la tabla 'bookings'.
 * @module services/booking
 */

const { db } = require('../config/database');

async function findAllBookings(userId, classId) {
  const query = db('bookings')
    .join('users', 'bookings.user_id', 'users.id')
    .join('classes', 'bookings.class_id', 'classes.id')
    .select(
      'bookings.*', 
      'users.first_name', 
      'users.last_name', 
      'classes.start_time'
    );

  if (userId) query.where('bookings.user_id', userId);
  if (classId) query.where('bookings.class_id', classId);

  return query;
}

async function findBookingByUserAndClass(userId, classId) {
  return await db('bookings')
    .where('user_id', userId)
    .where('class_id', classId)
    .first();
}

async function countActiveBookingsByClass(classId) {
  const result = await db('bookings')
    .where('class_id', classId)
    .where('status', 'confirmed')
    .count('id as total')
    .first();
  
  return parseInt(result.total || 0, 10);
}

async function addBooking(userId, classId) {
  const [id] = await db('bookings').insert({ user_id: userId, class_id: classId });
  return { id, user_id: userId, class_id: classId, status: 'confirmed' };
}

async function modifyBookingStatus(id, status) {
  await db('bookings').where('id', id).update({ status: status });
  return { id, status };
}

async function removeBooking(id) {
  await db('bookings').where('id', id).del();
}

async function findBooking(id) {
  return await db('bookings').where('id', id).first();
}

module.exports = {
  findAllBookings,
  findBookingByUserAndClass,
  countActiveBookingsByClass,
  addBooking,
  modifyBookingStatus,
  removeBooking,
  findBooking
};
/**
 * @file Controlador que gestiona las peticiones HTTP para las reservas (bookings).
 * @module controllers/booking.controller
 */

const bookingService = require("../services/booking.service");
const classService = require("../services/class.service");

async function getAllBookings(req, res) {
  try {
    // Usar el ID del usuario autenticado del JWT
    const userId = req.user.id;
    const classId = req.query.classId;

    const bookings = await bookingService.findAllBookings(userId, classId);
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener las reservas",
    });
  }
}

async function getBookingById(req, res) {
  try {
    const bookingData = await bookingService.findBooking(req.params.id);
    if (!bookingData) {
      return res.status(404).json({
        success: false,
        error: "La reserva solicitada no existe",
      });
    }
    res.status(200).json({
      success: true,
      data: bookingData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener la reserva",
    });
  }
}

async function createBooking(req, res) {
  try {
    // Usar el userId del token de autenticación (más seguro)
    const userId = req.user.id;
    const { classId, class_id } = req.body;

    // Aceptar tanto classId como class_id para compatibilidad
    const finalClassId = classId || class_id;

    if (!finalClassId) {
      return res.status(400).json({
        success: false,
        error: "El ID de la clase es requerido",
      });
    }

    const bookingConflict = await bookingService.findBookingByUserAndClass(
      userId,
      finalClassId,
    );
    if (bookingConflict) {
      return res.status(400).json({
        success: false,
        error: "El usuario ya tiene una reserva para esta clase",
      });
    }

    const classData = await classService.findClass(finalClassId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        error: "La clase que intentas reservar no existe",
      });
    }

    const currentBookings =
      await bookingService.countActiveBookingsByClass(finalClassId);
    if (currentBookings >= classData.capacity) {
      return res.status(400).json({
        success: false,
        error: "Lo sentimos, la clase ya está llena",
      });
    }

    const newBooking = await bookingService.addBooking(userId, finalClassId);
    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      data: newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error al crear la reserva",
    });
  }
}

async function updateBooking(req, res) {
  try {
    const { status } = req.body;
    const updatedBooking = await bookingService.modifyBookingStatus(
      req.params.id,
      status,
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la reserva" });
  }
}

async function deleteBooking(req, res) {
  try {
    await bookingService.removeBooking(req.params.id);
    res.status(200).json({
      success: true,
      message: "Reserva eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al eliminar la reserva",
    });
  }
}

/**
 * Obtiene las próximas clases reservadas del usuario autenticado.
 * @param {Object} req - Objeto de petición Express (contiene req.user.id).
 * @param {Object} res - Objeto de respuesta Express.
 */
async function getMyUpcomingBookings(req, res) {
  try {
    const userId = req.user.id;
    const upcomingClasses = await bookingService.findUpcomingBookings(userId);
    res.status(200).json({
      success: true,
      data: upcomingClasses,
    });
  } catch (error) {
    console.error("[getMyUpcomingBookings] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener tus próximas clases",
    });
  }
}

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getMyUpcomingBookings,
};
booking.controller.js
/**
 * @file Controlador que gestiona las peticiones HTTP para las categorías.
 * @module controllers/category.controller
 */

const categoryService = require("../services/category.service");

async function getAllCategories(req, res) {
  try {
    const categories = await categoryService.findAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error en getAllCategories:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener las categorías" });
  }
}

async function getCategoryById(req, res) {
  try {
    const category = await categoryService.findCategoryById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "La categoría solicitada no existe" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Error en getCategoryById:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener la categoría" });
  }
}

async function createCategory(req, res) {
  try {
    const { title, description, slug } = req.body;

    const newCategory = await categoryService.addCategory(
      title,
      description,
      slug,
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Categoría creada con éxito",
        data: newCategory,
      });
  } catch (error) {
    console.error("Error en createCategory:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al guardar la categoría en la base de datos",
      });
  }
}

async function updateCategory(req, res) {
  try {
    const { title, description, slug } = req.body;

    const existingCategory = await categoryService.findCategoryById(
      req.params.id,
    );
    if (!existingCategory) {
      return res
        .status(404)
        .json({
          success: false,
          message: "La categoría que intentas actualizar no existe",
        });
    }

    const updatedCategory = await categoryService.modifyCategory(
      req.params.id,
      title,
      description,
      slug,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Categoría actualizada correctamente",
        data: updatedCategory,
      });
  } catch (error) {
    console.error("Error en updateCategory:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar la categoría" });
  }
}

async function deleteCategory(req, res) {
  try {
    const existingCategory = await categoryService.findCategoryById(
      req.params.id,
    );
    if (!existingCategory) {
      return res
        .status(404)
        .json({
          success: false,
          message: "La categoría que intentas eliminar no existe",
        });
    }

    await categoryService.removeCategory(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Categoría eliminada definitivamente" });
  } catch (error) {
    console.error("Error en deleteCategory:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al intentar eliminar la categoría",
      });
  }
}

async function getCategoriesWithModalities(req, res) {
  try {
    const categories = await categoryService.findCategoriesWithModalities();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error en getCategoriesWithModalities:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener las categorías con modalidades",
      });
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithModalities,
};

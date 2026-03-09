/**
 * @file Controlador que gestiona las peticiones HTTP para las clases.
 * @module controllers/class.controller
 */

const classService = require("../services/class.service");

/**
 * Devuelve la lista de todas las clases.
 * Si el usuario está autenticado, incluye isBooked e isFull.
 * @param {Object} req - Objeto de petición Express (puede incluir req.query.modalityId, req.query.futureOnly y req.user).
 * @param {Object} res - Objeto de respuesta Express.
 */
async function getAllClasses(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const futureOnly = req.query.futureOnly === "true";

    console.log("[getAllClasses] userId:", userId, "futureOnly:", futureOnly);

    const classes = await classService.findAllClasses(
      req.query.modalityId,
      req.query.search,
      userId,
      futureOnly,
    );

    console.log("[getAllClasses] Returning", classes.length, "classes");

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error("[getAllClasses] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener las clases",
    });
  }
}

/**
 * Devuelve una clase específica basada en su ID.
 * @param {Object} req - Objeto de petición Express (contiene req.params.id).
 * @param {Object} res - Objeto de respuesta Express.
 */
async function getClassById(req, res) {
  try {
    const classData = await classService.findClass(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: "La clase solicitada no existe",
      });
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener la clase",
    });
  }
}

/**
 * Crea una nueva clase verificando que no falten datos ni haya conflictos de horario.
 * @param {Object} req - Objeto de petición Express (contiene los datos en req.body).
 * @param {Object} res - Objeto de respuesta Express.
 */
async function createClass(req, res) {
  try {
    const { modalityId, instructorId, startTime, endTime, capacity } = req.body;

    console.log("[createClass] Received data:", {
      modalityId,
      instructorId,
      startTime,
      endTime,
      capacity,
    });

    // Validación de negocio: Evitar solapamiento de clases para el mismo instructor
    const classConflict = await classService.findClassByInstructorAndTime(
      instructorId,
      startTime,
    );
    if (classConflict) {
      return res.status(400).json({
        success: false,
        error: "El instructor ya tiene clase a esa hora",
      });
    }

    const newClass = await classService.addClass(
      modalityId,
      instructorId,
      startTime,
      endTime,
      capacity,
    );

    console.log("[createClass] Class created successfully:", newClass);
    res.status(201).json({
      success: true,
      data: newClass,
      message: "Clase creada exitosamente",
    });
  } catch (error) {
    console.error("[createClass] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al crear la clase",
      details: error.message,
    });
  }
}

/**
 * Actualiza una clase existente verificando que se envíen todos los datos.
 * @param {Object} req - Objeto de petición Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
async function updateClass(req, res) {
  try {
    const { modalityId, instructorId, startTime, endTime, capacity } = req.body;

    const updatedClass = await classService.modifyClass(
      req.params.id,
      modalityId,
      instructorId,
      startTime,
      endTime,
      capacity,
    );
    res.status(200).json({
      success: true,
      data: updatedClass,
      message: "Clase actualizada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al actualizar la clase",
    });
  }
}

/**
 * Elimina una clase específica basada en su ID.
 * Borrado controlado: si la clase tiene reservas asociadas, devuelve 409 con un aviso.
 * Para confirmar el borrado con reservas, enviar ?force=true en la query.
 * @param {Object} req - Objeto de petición Express (req.params.id, req.query.force).
 * @param {Object} res - Objeto de respuesta Express.
 */
async function deleteClass(req, res) {
  try {
    const existingClass = await classService.findClass(req.params.id);
    if (!existingClass) {
      return res.status(404).json({
        success: false,
        error: "La clase que intentas eliminar no existe",
      });
    }

    const bookingCount = await classService.countBookingsByClass(req.params.id);
    if (bookingCount > 0 && req.query.force !== "true") {
      return res.status(409).json({
        success: false,
        error: `La clase tiene ${bookingCount} reserva(s) asociada(s). Envía ?force=true para confirmar el borrado.`,
        bookingCount,
      });
    }

    await classService.removeClass(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Clase eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar la clase" });
  }
}

/**
 * Devuelve las clases del instructor autenticado.
 * @param {Object} req - Objeto de petición Express (contiene req.user.id).
 * @param {Object} res - Objeto de respuesta Express.
 */
async function getMyClasses(req, res) {
  try {
    const instructorId = req.user.id;
    const classes = await classService.findClassesByInstructor(instructorId);
    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener tus clases",
    });
  }
}

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getMyClasses,
};

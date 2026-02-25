/**
 * @file Controlador que gestiona las peticiones HTTP para las modalidades.
 * @module controllers/modality.controller
 */

const modalityService = require("../services/modality.service");

async function getAllModalities(req, res) {
  try {
    const modalities = await modalityService.findAllModalities();
    res.status(200).json({ success: true, data: modalities });
  } catch (error) {
    console.error("Error en getAllModalities:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener las modalidades" });
  }
}

async function getModalityById(req, res) {
  try {
    const modality = await modalityService.findModalityById(req.params.id);

    if (!modality) {
      return res
        .status(404)
        .json({ success: false, message: "La modalidad solicitada no existe" });
    }

    res.status(200).json({ success: true, data: modality });
  } catch (error) {
    console.error("Error en getModalityById:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener la modalidad" });
  }
}

async function createModality(req, res) {
  try {
    const { title, description, image_url, category_id } = req.body;

    const newModality = await modalityService.addModality(
      title,
      description,
      image_url,
      category_id,
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Modalidad creada con éxito",
        data: newModality,
      });
  } catch (error) {
    console.error("Error en createModality:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al guardar la modalidad en la base de datos",
      });
  }
}

async function updateModality(req, res) {
  try {
    const { title, description, image_url, category_id } = req.body;

    const existingModality = await modalityService.findModalityById(
      req.params.id,
    );
    if (!existingModality) {
      return res
        .status(404)
        .json({
          success: false,
          message: "La modalidad que intentas actualizar no existe",
        });
    }

    const updatedModality = await modalityService.modifyModality(
      req.params.id,
      title,
      description,
      image_url,
      category_id,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Modalidad actualizada correctamente",
        data: updatedModality,
      });
  } catch (error) {
    console.error("Error en updateModality:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar la modalidad" });
  }
}

async function deleteModality(req, res) {
  try {
    const existingModality = await modalityService.findModalityById(
      req.params.id,
    );
    if (!existingModality) {
      return res
        .status(404)
        .json({
          success: false,
          message: "La modalidad que intentas eliminar no existe",
        });
    }

    await modalityService.removeModality(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Modalidad eliminada definitivamente" });
  } catch (error) {
    console.error("Error en deleteModality:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al intentar eliminar la modalidad",
      });
  }
}

module.exports = {
  getAllModalities,
  getModalityById,
  createModality,
  updateModality,
  deleteModality,
};

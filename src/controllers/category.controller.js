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
    res.status(201).json({
      success: true,
      message: "Categoría creada con éxito",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error en createCategory:", error);
    res.status(500).json({
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
      return res.status(404).json({
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
    res.status(200).json({
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
      return res.status(404).json({
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
    res.status(500).json({
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
    res.status(500).json({
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

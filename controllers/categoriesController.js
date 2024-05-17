const Category = require("../models/CategoryModel");

// Create Category Function -----------------------------------------------------------------
const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required!" });
  }
  try {
    const category = await Category.create({ name });
    return res.status(201).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Categories Function -------------------------------------------------------------------
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Categories Count Function --------------------------------------------------------
const getCcategoriesCount = async (req, res) => {
  try {
    const categoriesCount = await Category.countDocuments();
    return res.status(200).json({ success: true, categoriesCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Category Function ---------------------------------------------------------
const getCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found!" });
    }

    return res.status(200).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category Function -----------------------------------------------------------------
const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const categoryExist = await Category.findById(categoryId);

    if (!categoryExist) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { ...req.body },
      { new: true }
    );

    return res.status(200).json({ success: true, updatedCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category Function -----------------------------------------------------------------
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const categoryExist = await Category.findById(categoryId);
    if (!categoryExist) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await Category.findByIdAndDelete(categoryId);
    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCcategoriesCount,
  getCategory,
  updateCategory,
  deleteCategory,
};

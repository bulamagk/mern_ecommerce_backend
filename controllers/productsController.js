const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const cloudinary = require("../utils/cloudinary");

// Create Product Function --------------------------------------------------------------
const createProduct = async (req, res) => {
  const { name, description, price, category, countInStock } = req.body;

  if (!(name && description && price && category && countInStock)) {
    return res
      .status(400)
      .json({ success: false, message: "Enter all required fields!" });
  }

  try {
    // Check category
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Category" });
    }

    // Upload product image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecommerce/products",
    });

    const product = await Product.create({
      name,
      description,
      price,
      category,
      countInStock,
      image: {
        public_id: result.public_id,
        secure_url: result.secure_url,
      },
    });

    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error.message, message: "Server error" });
  }
};

// Get Products Function ----------------------------------------------------------------
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate({
      path: "category",
      select: "name -_id",
    });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Product Function ----------------------------------------------------------
const getProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product Function --------------------------------------------------------------
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const productExist = await Product.findById(productId);

    if (!productExist) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true }
    );

    return res.status(200).json({ success: true, updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product Function -----------------------------------------------------------------
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const productExist = await Product.findById(productId);
    if (!productExist) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete product image on cloudinary
    const product_public_id = productExist?.image?.public_id;
    if (product_public_id) {
      await cloudinary.uploader.destroy(product_public_id);
    }

    await Product.findByIdAndDelete(productId);
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

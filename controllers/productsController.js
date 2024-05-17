const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const cloudinary = require("../utils/cloudinary");

// Create Product Function --------------------------------------------------------------
const createProduct = async (req, res) => {
  const { name, description, price, category, countInStock, isFeatured } =
    req.body;

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
      isFeatured,
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
  const { categoryId, isFeatured } = req.query;
  let filter = {};

  if (categoryId) {
    filter = { category: categoryId };
  }

  if (isFeatured) {
    filter = { isFeatured: String(isFeatured) == "true" ? true : false };
  }

  try {
    const products = await Product.find(filter)
      .populate({
        path: "category",
        select: "name -_id",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Productsn Count Function ---------------------------------------------------------
const getProductCount = async (req, res) => {
  const { categoryId, isFeatured } = req.query;
  let filter = {};

  if (categoryId) {
    filter = { category: categoryId };
  }

  if (isFeatured) {
    filter = { isFeatured: String(isFeatured) == "true" ? true : false };
  }

  try {
    const productCount = await Product.countDocuments(filter);
    return res.status(200).json({ success: true, productCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Product Function ----------------------------------------------------------
const getProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId).populate({
      path: "category",
      select: "name -_id",
    });
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

// Update Product Image Function --------------------------------------------------------
const updateProductImage = async (req, res) => {
  const productId = req.params.id;
  try {
    const productExist = await Product.findById(productId);

    if (!productExist) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update product image
    const productImagePublicId = productExist?.image?.public_id;
    await cloudinary.uploader.upload(req.file.path, {
      public_id: productImagePublicId,
    });

    return res
      .status(200)
      .json({ success: true, message: "Product image updated successfully!" });
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

    // Delete product gallery images if exist
    const galleryImages = productExist.gallery;
    if (galleryImages.length > 0) {
      // Delete gallery Images
      galleryImages.forEach(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      });
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

// Add product gallery image ------------------------------------------------------------
const addGalleryImage = async (req, res) => {
  const productId = req.params.id;
  try {
    const productExist = await Product.findById(productId);
    if (!productExist) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Upload gallery image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecommerce/products",
    });

    const galleryImage = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };

    productExist.gallery.push(galleryImage);

    await productExist.save();

    return res.status(200).json({
      success: true,
      message: "Product image added successfully!",
      product: productExist,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Delete product gallery image ---------------------------------------------------------
const deleteGalleryImage = async (req, res) => {
  const productId = req.params.id;
  const imageId = req.query.imageId;

  try {
    const productExist = await Product.findById(productId);
    if (!productExist) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Find gallery image
    const galleryImage = productExist.gallery.find(
      (image) => image._id == imageId
    );

    // Delete product image on cloudinary
    await cloudinary.uploader.destroy(galleryImage.public_id);

    productExist.gallery.pull({ _id: imageId });

    await productExist.save();

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully!",
      product: productExist,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductCount,
  getProduct,
  updateProduct,
  updateProductImage,
  deleteProduct,
  addGalleryImage,
  deleteGalleryImage,
};

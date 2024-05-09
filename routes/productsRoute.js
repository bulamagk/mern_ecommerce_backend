const router = require("express").Router();
const upload = require("../middleware/multer");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addGalleryImage,
  deleteGalleryImage,
  updateProductImage,
} = require("../controllers/productsController");
const { verifyAuth, verifyRole } = require("../middleware/verifyJWTs");

/*
 * ROUTE        /api/products
 * DESC         Create product
 * METHOD       POST
 * ACCESS       Private
 */
router.post(
  "/",
  upload.single("product_image"),
  verifyAuth,
  verifyRole("user", "admin"),
  createProduct
);

/*
 * ROUTE        /api/products
 * DESC         Get list of products
 * METHOD       GET
 * ACCESS       Public
 */
router.get("/", getProducts);

/*
 * ROUTE        /api/products/:id
 * DESC         Get a single product based on product id
 * METHOD       GET
 * ACCESS       Public
 */
router.get("/:id", getProduct);

/*
 * ROUTE        /api/products/:id
 * DESC         Update product
 * METHOD       GET
 * ACCESS       Public
 */
router.put("/:id", verifyAuth, verifyRole("user", "admin"), updateProduct);

/*
 * ROUTE        /api/products/image/:id
 * DESC         Update product image
 * METHOD       PUT
 * ACCESS       Private
 */
router.put(
  "/image/:id",
  verifyAuth,
  verifyRole("user", "admin"),
  upload.single("product_image"),
  updateProductImage
);

/*
 * ROUTE        /api/products/:id
 * DESC         Delete a product with specified id
 * METHOD       DELETE
 * ACCESS       Private
 */
router.delete("/:id", verifyAuth, verifyRole("user", "admin"), deleteProduct);

/*
 * ROUTE        /api/products/:id
 * DESC         Delete a product gallery image with specified id
 * METHOD       DELETE
 * ACCESS       Private
 */
router.delete(
  "/gallery/:id",
  verifyAuth,
  verifyRole("user", "admin"),
  deleteGalleryImage
);

/*
 * ROUTE        /api/products/gallery/:id
 * DESC         Add a product gallery image
 * METHOD       PUT
 * ACCESS       Private
 */
router.put(
  "/gallery/:id",
  verifyAuth,
  verifyRole("user", "admin"),
  upload.single("gallery_image"),
  addGalleryImage
);

module.exports = router;

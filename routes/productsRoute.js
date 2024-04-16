const router = require("express").Router();
const upload = require("../middleware/multer");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

/*
 * ROUTE        /api/products
 * DESC         Create product
 * METHOD       POST
 * ACCESS       Private
 */
router.post("/", upload.single("product_image"), createProduct);

/*
 * ROUTE        /api/products
 * DESC         Get list of products
 * METHOD       GET
 * ACCESS       Private
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
router.put("/:id", updateProduct);

/*
 * ROUTE        /api/products/:id
 * DESC         Delete a product with specified id
 * METHOD       GET
 * ACCESS       Private
 */
router.delete("/:id", deleteProduct);

module.exports = router;

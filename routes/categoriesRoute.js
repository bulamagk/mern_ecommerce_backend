const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCcategoriesCount,
} = require("../controllers/categoriesController");
const { verifyAuth, verifyRole } = require("../middleware/verifyJWTs");

const router = require("express").Router();

/*
 * ROUTE        /api/categories
 * DESC         Create order
 * METHOD       POST
 * ACCESS       Private
 */
// router.post("/", verifyAuth, verifyRole("user", "admin"), createCategory);
router.post("/", createCategory);

/*
 * ROUTE        /api/categories
 * DESC         Get list of categories
 * METHOD       GET
 * ACCESS       Public
 */
router.get("/", getCategories);

/*
 * ROUTE        /api/categories/count
 * DESC         Get total number of categories
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/count", getCcategoriesCount);

/*
 * ROUTE        /api/categories/:id
 * DESC         Get a single order based on order id
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/:id", getCategory);

/*
 * ROUTE        /api/categories/:id
 * DESC         Update order
 * METHOD       GET
 * ACCESS       Public
 */
// router.put("/:id", verifyAuth, verifyRole("user", "admin"), updateCategory);
router.put("/:id", updateCategory);

/*
 * ROUTE        /api/categories/:id
 * DESC         Delete a order with specified id
 * METHOD       GET
 * ACCESS       Private
 */
// router.delete("/:id", verifyAuth, verifyRole("user", "admin"), deleteCategory);
router.delete("/:id", deleteCategory);

module.exports = router;

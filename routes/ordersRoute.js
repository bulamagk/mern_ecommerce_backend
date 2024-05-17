const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  verifyOrder,
  getOrdersCount,
} = require("../controllers/ordersController");
const { verifyAuth, verifyRole } = require("../middleware/verifyJWTs");

const router = require("express").Router();

/*
 * ROUTE        /api/orders
 * DESC         Create order
 * METHOD       POST
 * ACCESS       Private
 */
router.post("/", verifyAuth, createOrder);

/*
 * ROUTE        /api/orders/verify
 * DESC         Verify order
 * METHOD       POST
 * ACCESS       Private
 */
router.post("/verify", verifyAuth, verifyOrder);

/*
 * ROUTE        /api/orders
 * DESC         Get list of orders
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/", verifyAuth, getOrders);

/*
 * ROUTE        /api/orders/count
 * DESC         Get total number of orders
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/count", verifyAuth, verifyRole("admin"), getOrdersCount);

/*
 * ROUTE        /api/orders/:id
 * DESC         Get a single order based on order id
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/:id", verifyAuth, getOrder);

/*
 * ROUTE        /api/orders/:id
 * DESC         Update order
 * METHOD       GET
 * ACCESS       Public
 */
router.put("/:id", verifyAuth, verifyRole("user", "admin"), updateOrder);

/*
 * ROUTE        /api/orders/:id
 * DESC         Delete a order with specified id
 * METHOD       GET
 * ACCESS       Private
 */
router.delete("/:id", verifyAuth, deleteOrder);

module.exports = router;

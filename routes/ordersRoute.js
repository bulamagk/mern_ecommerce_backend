const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordersController");

const router = require("express").Router();

/*
 * ROUTE        /api/orders
 * DESC         Create order
 * METHOD       POST
 * ACCESS       Private
 */
router.post("/", createOrder);

/*
 * ROUTE        /api/orders
 * DESC         Get list of orders
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/", getOrders);

/*
 * ROUTE        /api/orders/:id
 * DESC         Get a single order based on order id
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/:id", getOrder);

/*
 * ROUTE        /api/orders/:id
 * DESC         Update order
 * METHOD       GET
 * ACCESS       Public
 */
router.put("/:id", updateOrder);

/*
 * ROUTE        /api/orders/:id
 * DESC         Delete a order with specified id
 * METHOD       GET
 * ACCESS       Private
 */
router.delete("/:id", deleteOrder);

module.exports = router;

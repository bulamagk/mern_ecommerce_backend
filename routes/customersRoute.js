const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  login,
  logout,
} = require("../controllers/customersController");
const { verifyAuth } = require("../middleware/verifyJWTs");

const router = require("express").Router();

/*
 * ROUTE        /api/customers
 * DESC         Create customer
 * METHOD       POST
 * ACCESS       Public
 */
router.post("/", createCustomer);

/*
 * ROUTE        /api/customers
 * DESC         Get list of customers
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/", verifyAuth, getCustomers);

/*
 * ROUTE        /api/customers/:id
 * DESC         Get a single customer based on Customer id
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/:id", verifyAuth, getCustomer);

/*
 * ROUTE        /api/customers/:id
 * DESC         Update Customer
 * METHOD       GET
 * ACCESS       Private
 */
router.put("/:id", verifyAuth, updateCustomer);

/*
 * ROUTE        /api/customers/:id
 * DESC         Delete a customer with specified id
 * METHOD       GET
 * ACCESS       Private
 */
router.delete("/:id", verifyAuth, deleteCustomer);

/*
 * ROUTE        /api/customers/login
 * DESC         Authenticate a customer
 * METHOD       POST
 * ACCESS       Public
 */
router.post("/login", login);

/*
 * ROUTE        /api/customers/logout
 * DESC         Logout a customer
 * METHOD       POST
 * ACCESS       Public
 */
router.post("/logout/:customerId", logout);

module.exports = router;

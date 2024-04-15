const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customersController");

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
router.get("/", getCustomers);

/*
 * ROUTE        /api/customers/:id
 * DESC         Get a single customer based on Customer id
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/:id", getCustomer);

/*
 * ROUTE        /api/customers/:id
 * DESC         Update Customer
 * METHOD       GET
 * ACCESS       Private
 */
router.put("/:id", updateCustomer);

/*
 * ROUTE        /api/customers/:id
 * DESC         Delete a customer with specified id
 * METHOD       GET
 * ACCESS       Private
 */
router.delete("/:id", deleteCustomer);

module.exports = router;

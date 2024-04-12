const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const router = require("express").Router();

/*
 * ROUTE        /api/users
 * DESC         Create User
 * METHOD       POST
 * ACCESS       Private
 */
router.post("/", createUser);

/*
 * ROUTE        /api/users
 * DESC         Get list of users
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/", getUsers);

/*
 * ROUTE        /api/users/:id
 * DESC         Get a single user based on user id
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/:id", getUser);

/*
 * ROUTE        /api/users/:id
 * DESC         Update user
 * METHOD       GET
 * ACCESS       Private
 */
router.put("/:id", updateUser);

/*
 * ROUTE        /api/users/:id
 * DESC         Delete a user with specified id
 * METHOD       GET
 * ACCESS       Private
 */
router.delete("/:id", deleteUser);

module.exports = router;

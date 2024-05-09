const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
  logout,
} = require("../controllers/usersController");
const { verifyAuth } = require("../middleware/verifyJWTs");

const router = require("express").Router();

/*
 * ROUTE        /api/users
 * DESC         Create User
 * METHOD       POST
 * ACCESS       Private
 */
router.post("/", verifyAuth, createUser);

/*
 * ROUTE        /api/users
 * DESC         Get list of users
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/", verifyAuth, getUsers);

/*
 * ROUTE        /api/users/:id
 * DESC         Get a single user based on user id
 * METHOD       GET
 * ACCESS       Private
 */
router.get("/:id", verifyAuth, getUser);

/*
 * ROUTE        /api/users/:id
 * DESC         Update user
 * METHOD       GET
 * ACCESS       Private
 */
router.put("/:id", verifyAuth, updateUser);

/*
 * ROUTE        /api/users/:id
 * DESC         Delete a user with specified id
 * METHOD       GET
 * ACCESS       Private
 */
router.delete("/:id", verifyAuth, deleteUser);

/*
 * ROUTE        /api/users/login
 * DESC         Login a user
 * METHOD       POST
 * ACCESS       Public
 */
router.post("/login", login);

/*
 * ROUTE        /api/users/logout
 * DESC         Logout a user
 * METHOD       POST
 * ACCESS       Private
 */
router.post("/logout/:userId", logout);

module.exports = router;

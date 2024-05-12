const {
  resetLinkRequest,
  verifyResetLink,
  newPassword,
} = require("../controllers/forgotPasswordController");

const router = require("express").Router();

router.post("/", resetLinkRequest);
router.post("/verify", verifyResetLink);
router.put("/new", newPassword);

module.exports = router;

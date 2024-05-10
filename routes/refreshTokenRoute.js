const router = require("express").Router();
const { handleRefreshToken } = require("../controllers/refreshTokenController");

router.post("/", handleRefreshToken);

module.exports = router;

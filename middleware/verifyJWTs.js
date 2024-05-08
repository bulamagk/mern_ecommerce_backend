const jwt = require("jsonwebtoken");

const verifyAuth = async (req, res, next) => {
  let token;

  const bearerToken = req.headers.Authorization || req.headers.authorization;
  if (bearerToken) {
    token = bearerToken.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, No Token" });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = {
  verifyAuth,
};

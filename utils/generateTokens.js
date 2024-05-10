const jwt = require("jsonwebtoken");

const generateAccessToken = async (userId, userRole) => {
  const token = jwt.sign(
    { userId, userRole },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  return token;
};

const generateRefreshToken = async (userId, userRole) => {
  const token = jwt.sign(
    { userId, userRole },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};

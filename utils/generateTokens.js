const jwt = require("jsonwebtoken");

const generateAccessToken = async (userId, userRole) => {
  const token = jwt.sign(
    { userId, userRole },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );
  return token;
};

module.exports = {
  generateAccessToken,
};

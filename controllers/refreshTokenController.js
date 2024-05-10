const jwt = require("jsonwebtoken");

const { generateAccessToken } = require("../utils/generateTokens");

const handleRefreshToken = async (req, res) => {
  const token = req?.cookies?.jwt;

  if (!token) {
    return res.status(400).json({ success: false, message: "No token" });
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Generate new access token
    const accessToken = await generateAccessToken(
      payload.userId,
      payload.userRole
    );
    return res.status(200).json({ success: true, accessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error occured", error });
  }
};

module.exports = { handleRefreshToken };

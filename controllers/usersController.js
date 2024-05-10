const User = require("../models/UserModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

// Create User Function -----------------------------------------------------------------
const createUser = async (req, res) => {
  const { surname, othername, email, phone, address, password, role } =
    req.body;

  // Validate fields
  if (
    !(surname && othername && email && phone && address && password && role)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Enter all required fields" });
  }

  try {
    // Check if email already exist
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({
        success: false,
        message: `User with this email [${email}] already exist`,
      });
    }
    // Check if phone already exist
    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      return res.status(409).json({
        success: false,
        message: `User with this phone [${phone}] already exist`,
      });
    }

    const user = await User.create({
      surname,
      othername,
      email,
      phone,
      address,
      password,
      role,
    });
    return res.status(201).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Users Function -------------------------------------------------------------------
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { refreshToken: 0 });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single User Function -------------------------------------------------------------
const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let user = await User.findById(userId, { password: 0, refreshToken: 0 });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Function -----------------------------------------------------------------
const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User Function -----------------------------------------------------------------
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login User Function --------------------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required!" });
  }

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }
    if (userExist && (await userExist.comparePasswords(password))) {
      // Generate refresh token

      const refreshToken = await generateRefreshToken(
        userExist._id,
        userExist.role
      );

      // Save refresh token in database
      userExist.refreshToken = refreshToken;
      await userExist.save();

      // Set httpOnly Cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production" ? true : false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      // Generate access token
      const accessToken = await generateAccessToken(
        userExist._id,
        userExist.role
      );

      const user = {
        id: userExist._id,
        email: userExist.email,
        surname: userExist.surname,
        othername: userExist.othername,
        address: userExist.address,
        phone: userExist.phone,
      };
      return res.status(200).json({ user, accessToken });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Wrong email or/and password!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout user Function --------------------------------------------------------------
const logout = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "user ID is required" });
  }

  try {
    // Find and clear user refresh token
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    user.refreshToken = "";
    await user.save();

    // Clear cookie
    res.clearCookie("jwt", { httpOnly: true, maxAge: new Date(0) });

    return res.status(200).json({
      success: true,
      message: "You are logged out successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
  logout,
};

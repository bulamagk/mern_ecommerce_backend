const User = require("../models/UserModel");

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
    const users = await User.find({}, { password: 0, refreshToken: 0 });
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

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};

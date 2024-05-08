const Customer = require("../models/CustomerModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

// Create Customer Function -----------------------------------------------------------------
const createCustomer = async (req, res) => {
  const { surname, othername, email, phone, address, password } = req.body;

  // Validate fields
  if (!(surname && othername && email && phone && address && password)) {
    return res
      .status(400)
      .json({ success: false, message: "Enter all required fields" });
  }

  try {
    // Check if email already exist
    const emailExist = await Customer.findOne({ email });
    if (emailExist) {
      return res.status(409).json({
        success: false,
        message: `Customer with this email [${email}] already exist`,
      });
    }
    // Check if phone already exist
    const phoneExist = await Customer.findOne({ phone });
    if (phoneExist) {
      return res.status(409).json({
        success: false,
        message: `Customer with this phone [${phone}] already exist`,
      });
    }

    const customer = await Customer.create({
      surname,
      othername,
      email,
      phone,
      address,
      password,
    });
    customer.password = null;
    return res.status(201).json({ success: true, customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Customers Function -------------------------------------------------------------------
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}, { password: 0, refreshToken: 0 });
    return res.status(200).json({ success: true, customers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Customer Function -------------------------------------------------------------
const getCustomer = async (req, res) => {
  const customerId = req.params.id;

  try {
    let customer = await Customer.findById(customerId, {
      password: 0,
      refreshToken: 0,
    });
    return res.status(200).json({ success: true, customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Customer Function -----------------------------------------------------------------
const updateCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerExist = await Customer.findById(customerId);

    if (!customerExist) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { ...req.body },
      { new: true }
    );

    return res.status(200).json({ success: true, updatedCustomer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Customer Function -----------------------------------------------------------------
const deleteCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customerExist = await Customer.findById(customerId);
    if (!customerExist) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    await Customer.findByIdAndDelete(customerId);
    return res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login Customer Function --------------------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required!" });
  }

  try {
    const customerExist = await Customer.findOne({ email });
    if (!customerExist) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }
    if (customerExist && (await customerExist.comparePasswords(password))) {
      // Generate refresh token
      const refreshToken = await generateRefreshToken(customerExist._id, null);

      console.log(refreshToken);

      // Set httpOnly Cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production" ? true : false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      // Generate access token
      const accessToken = await generateAccessToken(customerExist._id, null);
      const customer = {
        id: customerExist._id,
        email: customerExist.email,
        surname: customerExist.surname,
        othername: customerExist.othername,
        address: customerExist.address,
        phone: customerExist.phone,
      };
      return res.status(200).json({ customer, accessToken });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Wrong email or/and password!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  login,
};

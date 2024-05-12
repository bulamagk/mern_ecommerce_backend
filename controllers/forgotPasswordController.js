const User = require("../models/UserModel");
const Customer = require("../models/CustomerModel");
const {
  generateResetPassworTokenExpirationTime,
  sendResetLink,
} = require("../utils/forgotPasswordUtils");

const resetLinkRequest = async (req, res) => {
  const { email, userType } = req.body;

  let resetToken, expirationPeriod, result;

  if (!userType) {
    return res
      .status(400)
      .json({ success: false, message: "User type is required" });
  }

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  switch (userType) {
    case "user":
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `An account with the email [${email}] not found!`,
        });
      }

      // Generate reset token
      resetToken = user._id;

      // Generate reset expiration time
      expirationPeriod = generateResetPassworTokenExpirationTime();

      // Send reset mail
      result = await sendResetLink(
        user.email,
        `${user.surname} ${user.othername}`,
        userType,
        resetToken
      );

      // Save expiration time and token
      user.resetPasswordToken = resetToken;
      user.resetLinkExpiration = expirationPeriod;
      await user.save();
      return res.status(200).json({
        success: true,
        message: `A password reset link is has been sent to ${email} and will expire in 5 minutes!`,
      });
      break;

    case "customer":
      const customer = await Customer.findOne({ email });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: `An account with the email [${email}] not found!`,
        });
      }

      // Generate reset token
      resetToken = customer._id;

      // Generate reset expiration time
      expirationPeriod = generateResetPassworTokenExpirationTime();

      // Send reset mail
      result = await sendResetLink(
        customer.email,
        `${customer.surname} ${customer.othername}`,
        userType,
        resetToken
      );

      // Save expiration time and token
      customer.resetPasswordToken = resetToken;
      customer.resetLinkExpiration = expirationPeriod;
      await customer.save();
      return res.status(200).json({
        success: true,
        message: `A password reset link is has been sent to ${email} and will expire in 5 minutes!`,
      });
      break;

    default:
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
  }
};

const verifyResetLink = async (req, res) => {
  const { userType, id } = req.body;
  let expirationPeriod, now;

  if (!(userType && id)) {
    return res
      .status(400)
      .json({ success: false, message: "User type and an id are required" });
  }

  switch (userType) {
    case "user":
      const user = await User.findById(id);

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid token" });
      }

      // Check token validity
      expirationPeriod = user.resetLinkExpiration;
      now = Date.now();
      if (now >= expirationPeriod) {
        return res
          .status(400)
          .json({ success: false, message: "Reset token expired" });
      }

      //  Set new token for reset
      user.resetPasswordToken = now;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Proceed with password reset",
        token: now,
        id,
        userType,
      });

    case "customer":
      const customer = await Customer.findById(id);

      if (!customer) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid token" });
      }

      // Check token validity
      expirationPeriod = customer.resetLinkExpiration;
      now = Date.now();
      if (now >= expirationPeriod) {
        return res
          .status(400)
          .json({ success: false, message: "Reset token expired" });
      }

      //  Set new token for reset
      customer.resetPasswordToken = now;
      await customer.save();

      return res.status(200).json({
        success: true,
        message: "Proceed with password reset",
        token: now,
        id,
        userType,
      });
    default:
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
  }
};

const newPassword = async (req, res) => {
  const { userType, token, id, password, confirmPassword } = req.body;

  if (!(userType && token && id && password && confirmPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "User type, token, id, password and confirm password are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password does not match!",
    });
  }

  switch (userType) {
    case "user":
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Error: Invalid user id" });
      }

      if (token != user.resetPasswordToken) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid reset token" });
      }

      user.password = password;
      user.resetLinkExpiration = "";
      user.resetPasswordToken = "";

      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "Password is successfully changed!" });
      break;

    case "customer":
      const customer = await Customer.findById(id);
      if (!customer) {
        return res
          .status(400)
          .json({ success: false, message: "Error: Invalid user id" });
      }

      if (token != customer.resetPasswordToken) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid reset token" });
      }

      customer.password = password;
      customer.resetLinkExpiration = "";
      customer.resetPasswordToken = "";

      await customer.save();

      return res
        .status(200)
        .json({ success: true, message: "Password is successfully changed!" });
      break;

    default:
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
  }
};

module.exports = { resetLinkRequest, verifyResetLink, newPassword };

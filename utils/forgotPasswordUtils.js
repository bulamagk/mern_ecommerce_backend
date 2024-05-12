const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Send reset link mail function
const sendResetLink = async (email, name, userType, token) => {
  const transport = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const html = generateForgotPasswodHtml(name, userType, token);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Reset Link",
      html,
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Generate reset expiration time
const generateResetPassworTokenExpirationTime = () =>
  Date.now() + 5 * 60 * 1000;

const generateForgotPasswodHtml = (name, userType, token) => {
  return `
    <h2>Dear ${name} </h2>
    <p>Click the following link to reset your password. <br/> <b style="color: red;">Note</b> The reset link expires after 5 minutes</p>
    <a href="${process.env.CLIENT_URL}/reset-password?usertype=${userType}&id=${token}">Click here </a>
`;
};

module.exports = {
  generateResetPassworTokenExpirationTime,
  sendResetLink,
};

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    surname: {
      type: String,
      required: true,
      min: 2,
    },
    othername: {
      type: String,
      required: true,
      min: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      street: {
        type: String,
      },
      town: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    password: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);

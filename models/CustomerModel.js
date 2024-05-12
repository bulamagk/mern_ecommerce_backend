const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema(
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
    resetLinkExpiration: {
      type: Number,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

customerSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) {
    return next();
  }
  this._update.password = await bcrypt.hash(this._update.password, 10);
  next();
});

// Compare password
customerSchema.methods.comparePasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Customer", customerSchema);

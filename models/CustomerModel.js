const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

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
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password
// customerSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

module.exports = mongoose.model("Customer", customerSchema);

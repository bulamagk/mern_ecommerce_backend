const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
    },
    description: {
      type: String,
      required: true,
      min: 2,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    countInStock: {
      type: Number,
      required: true,
    },
    image: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    gallery: [
      {
        public_id: String,
        secure_url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

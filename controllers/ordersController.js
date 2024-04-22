const Customer = require("../models/CustomerModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");

const axios = require("axios");

// Create Order Function -----------------------------------------------------------------
const createOrder = async (req, res) => {
  const { userId, orderItems } = req.body;

  if (!orderItems?.length) {
    return res.status(400).json({ success: false, message: "No order item!" });
  }

  try {
    // Find user
    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Customer not found, please log in to place an order",
      });
    }

    const orderItemsDetails = [];
    const outOfStockProducts = [];

    await Promise.all(
      orderItems.map(async (orderItem) => {
        // Get product
        const product = await Product.findById(orderItem.productId, {
          name: 1,
          countInStock: 1,
          price: 1,
        });

        if (product.countInStock < orderItem.count) {
          // Out of stock
          outOfStockProducts.push({
            _id: product._id,
            name: product.name,
            countInStock: product.countInStock,
            count: orderItem.count,
            pricePerUnit: product.price,
            message: `There are only ${product.countInStock} ${product.name} in stock but you want to order ${orderItem.count}`,
          });
        } else {
          orderItemsDetails.push({
            // In stock
            _id: product._id,
            name: product.name,
            countInStock: product.countInStock,
            count: orderItem.count,
            pricePerUnit: product.price,
            totalPrice: product.price * orderItem.count,
          });
        }
      })
    );

    if (outOfStockProducts.length) {
      return res
        .status(400)
        .json({ success: false, message: "Out of Stock", outOfStockProducts });
    }

    // Calculate total order amount
    const orderAmount = orderItemsDetails.reduce(
      (accumulator, currentValue) => accumulator + currentValue.totalPrice,
      0
    );

    // Initiate payment with paystack
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: orderAmount * 100,
        metadata: {
          userId,
          orderItemsDetails,
        },
        // callback_url:
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      orderItemsDetails,
      orderAmount,
      paystackResponse: paystackResponse.data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Orders Function -------------------------------------------------------------------
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Order Function -------------------------------------------------------------
const getOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Function -----------------------------------------------------------------
const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const orderExist = await Order.findById(orderId);

    if (!orderExist) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { ...req.body },
      { new: true }
    );

    return res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Order Function -----------------------------------------------------------------
const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const orderExist = await Order.findById(orderId);
    if (!orderExist) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await Order.findByIdAndDelete(orderId);
    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};

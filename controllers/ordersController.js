const Order = require("../models/OrdersModel");

// Create Order Function -----------------------------------------------------------------
const createOrder = async (req, res) => {};

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

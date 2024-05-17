const Customer = require("../models/CustomerModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const OrderItem = require("../models/OrderItemModel");

const axios = require("axios");

// Create Order Function -----------------------------------------------------------------
const createOrder = async (req, res) => {
  const { customerId, orderItems } = req.body;

  if (!orderItems?.length) {
    return res.status(400).json({ success: false, message: "No order item!" });
  }

  try {
    // Find customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
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
          image: 1,
        });

        if (product.countInStock < orderItem.count) {
          // Out of stock
          outOfStockProducts.push({
            _id: product._id,
            name: product.name,
            countInStock: product.countInStock,
            count: orderItem.count,
            pricePerUnit: product.price,
            image: product?.image?.secure_url,
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
            image: product?.image?.secure_url,
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
        email: customer.email,
        amount: orderAmount * 100,
        metadata: {
          customerId,
          orderItemsDetails,
        },
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

// Verify Order Payment Function --------------------------------------------------------
const verifyOrder = async (req, res) => {
  const { reference } = req.body;
  if (!reference) {
    return res
      .status(400)
      .json({ success: false, message: "Reference is required" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check verification status and proceed with order if status is success
    if (response.data.status) {
      const orderData = response.data.data.metadata;

      // Save orderItems
      const orderItems = [...orderData.orderItemsDetails];
      const orderItemsIdsArray = [];

      await Promise.all(
        orderItems.map(async (item) => {
          const orderItem = await OrderItem.create({
            product: item._id,
            count: item.count,
            pricePerUnit: item.pricePerUnit,
            totalPrice: item.totalPrice,
          });

          // Update to reduce product count in stock
          const product = await Product.findById(item._id);
          product.countInStock = product.countInStock - item.count;
          await product.save();

          orderItemsIdsArray.push(orderItem._id);
        })
      );

      // Order information to be saved
      let orderInfo = {
        customer: orderData.customerId,
        orderItems: orderItemsIdsArray, // To be updated
        totalCost: response.data.data.amount / 100, //
      };

      // Create order
      const order = await Order.create({ ...orderInfo });

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during payment verification",
      error: error?.response?.data,
    });
  }
};

// Get Orders Function ------------------------------------------------------------------
const getOrders = async (req, res) => {
  const { status, customerId } = req.query;
  let filter = {};

  if (status) {
    filter = { status };
  }

  if (customerId) {
    filter = { customer: customerId };
  }

  try {
    const orders = await Order.find(filter)
      .populate({
        path: "customer",
        select: "-password",
      })
      .populate({ path: "orderItems", populate: { path: "product" } });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Total Number of Orders Function --------------------------------------------------
const getOrdersCount = async (req, res) => {
  const { status } = req.query;
  let filter = {};

  if (status) {
    filter = { status };
  }

  try {
    const ordersCount = await Order.countDocuments(filter);
    return res.status(200).json({ success: true, ordersCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Order Function -------------------------------------------------------------
const getOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "customer",
        select: "-password",
      })
      .populate({ path: "orderItems", populate: { path: "product" } });
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

    if (orderExist.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "You cannot delete an incomplete order!",
      });
    }

    // Delete order items first
    const orderItems = orderExist.orderItems;
    await Promise.all(
      orderItems.map(async (item) => {
        await OrderItem.findByIdAndDelete(item);
      })
    );

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
  verifyOrder,
  getOrders,
  getOrdersCount,
  getOrder,
  updateOrder,
  deleteOrder,
};

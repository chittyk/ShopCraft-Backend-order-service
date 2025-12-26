
const Order = require("../models/Order");
const axios = require("axios");
const createOrder = async (req, res) => {
  try {
    const user = req.userId
    const { products, totalAmount, address, paymentMethod } = req.body;
    if (!user || !products || !totalAmount || !address || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = new Order({
      user,
      products,
      totalAmount,
      address,
      paymentMethod,
    });
    await newOrder.save();
    res.status(201).json({ msg: "order created successfuly", newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

const getOrderByUser = async (req, res) => {
  try {
    const  user  = req.userId;
    
    if (!user) return res.status(400).json({ msg: "Missing user ID" });

    const orders = await Order.find({ user });
    if (!orders.length) return res.status(404).json({ msg: "No orders found" });

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        // Fetch products for this order
        const products = await Promise.all(
          order.products.map(async (p) => {
            try {
              const productRes = await axios.get(`${process.env.BASEURL_PRODUCT}${p.product}`);
              return { ...productRes.data, quantity: p.quantity };
            } catch (err) {
              console.error(`Product not found: ${p.product}`, err.message);
              return { _id: p.product, name: "Product not found", quantity: p.quantity };
            }
          })
        );

        // Fetch the specific address for this order
        let addressData = null;
        try {
          const addressRes = await axios.get(`${process.env.BASEURL_ADDRESS}${order.address}`);
          addressData = addressRes.data;
        } catch (err) {
          console.error(`Address not found for order: ${order._id}`, err.message);
          addressData = { _id: order.address, info: "Address not found" };
        }

        return {
          _id: order._id,
          user: order.user,
          products,
          address: addressData, // This ensures each order gets its own address
          totalAmount: order.totalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      })
    );

    res.status(200).json(fullOrders);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ msg: "Failed to fetch orders", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "Order ID is required" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ msg: "No Order Found" });

    // Fetch products for this order
    const products = await Promise.all(
      order.products.map(async (p) => {
         try {
              const productRes = await axios.get(`${process.env.BASEURL_PRODUCT}${p.product}`);
              return { ...productRes.data, quantity: p.quantity };
            } catch (err) {
              console.error(`Product not found: ${p.product}`, err.message);
              return { _id: p.product, name: "Product not found", quantity: p.quantity };
            }
      })
    );

    // Fetch the address for this order
    let addressData = null;
    try {
      const addressRes = await axios.get(`${process.env.BASEURL_ADDRESS}${order.address}`);
      addressData = addressRes.data;
    } catch (err) {
      console.error(`Address not found for order: ${order._id}`, err.message);
      addressData = { _id: order.address, info: "Address not found" };
    }

    res.status(200).json({
      _id: order._id,
      user: order.user,
      products,
      address: addressData,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ msg: "Failed to fetch order", error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // optional, for logging

    if (!id) return res.status(400).json({ msg: "Order ID is required" });

    // Find the order
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    // Check if order is cancellable
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(403).json({
        msg: `Cannot cancel order. Current status: ${order.status}`,
      });
    }

    // Update order status to cancelled
    order.status = "cancelled";
    order.cancelReson = reason
    await order.save();


    // You can log the reason if needed
    console.log(`Order ${id} cancelled. Reason: ${reason || "No reason provided"}`);

    res.status(200).json({ msg: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ msg: "Failed to cancel order", error: error.message });
  }
};
module.exports = {
  createOrder,
  getOrderByUser,
  getOrderById,
  cancelOrder,
};

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    cancelReson:{
      type: String,
      default:""
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled",],
      default: "pending",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "credit_card", "debit_card", "upi", "paypal"],
      required: true,
    },
    isCanceled:{
      type:Boolean,
      default:false
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order',orderSchema)
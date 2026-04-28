const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: "String",
    required: true,
  },
  type: {
    type: "String",
    required: true,
    enum: ["income", "expense"],
  },
  amount: {
    type: "Number",
    required: true,
  },
  category: {
    type: "String",
    required: true,
  },
  date: {
    type: "String",
    required: true,
    default: new Date().toISOString(),
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);

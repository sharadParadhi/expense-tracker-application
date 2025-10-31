const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    date: { type: Date, default: Date.now },
  },
  {
    versionKey: false, // 🚫 disables "__v"
  }
);

const TransactionModel = mongoose.model('Transaction', TransactionSchema);

module.exports = { TransactionModel };

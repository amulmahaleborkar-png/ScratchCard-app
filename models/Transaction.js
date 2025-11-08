const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scratchCardId: {
    type: String,
    required: true,
    ref: 'ScratchCard'
  },
  date: {
    type: Date,
    default: Date.now
  },
    transactionAmount: {
  type: Number,
  required: true
}
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const scratchCardSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4, 
    unique: true
  },
  
  
  discountAmount: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isScratched: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const ScratchCard = mongoose.model('ScratchCard', scratchCardSchema);
module.exports = ScratchCard;

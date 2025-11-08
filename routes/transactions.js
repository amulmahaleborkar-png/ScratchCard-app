const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const ScratchCard = require('../models/ScratchCard');

router.post('/add', async (req, res) => {
  try {
    const { userId, scratchCardId } = req.body;
    if (!userId || !scratchCardId) {
      return res.status(400).json({ message: 'userId and scratchCardId are required.' });
    }
    // ObjectId format validation added here:
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId.' });
    }
    // Now run the original validation and logic:
    const user = await User.findById(userId);
    if (!user || user.isActive === false) {
      return res.status(400).json({ message: 'Invalid or inactive userId.' });
    }
    const scratchCard = await ScratchCard.findOne({ id: scratchCardId });
    if (!scratchCard) {
      return res.status(400).json({ message: 'Invalid scratchCardId.' });
    }
    if (!scratchCard.isActive || scratchCard.isScratched) {
      return res.status(400).json({ message: 'Scratch card is used or inactive.' });
    }
    if (scratchCard.expiryDate < new Date()) {
      return res.status(400).json({ message: 'Scratch card is expired.' });
    }
    const transaction = new Transaction({ userId, scratchCardId });
    await transaction.save();
    scratchCard.isScratched = true;
    await scratchCard.save();
    res.status(201).json({ message: 'Transaction completed.', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

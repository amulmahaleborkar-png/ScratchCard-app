const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const ScratchCard = require('../models/ScratchCard');

router.post('/add', async (req, res) => {
  try {
    const { userId, scratchCardId, transactionAmount } = req.body;
    if (!userId || !scratchCardId) {
      return res.status(400).json({ message: 'userId and scratchCardId are required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId.' });
    }
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
    const transaction = new Transaction({ userId, scratchCardId, transactionAmount});
    await transaction.save();
    scratchCard.isScratched = true;
    await scratchCard.save();
    res.status(201).json({ message: 'Transaction completed.', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    // Grab query params (filters)
    const { dateOfTransaction, userId, transactionAmount } = req.query;
    const filter = {};

    // Filter by dateOfTransaction (day)
    if (dateOfTransaction) {
      // Find transactions within this day (from 00:00:00 to 23:59:59)
      const startDate = new Date(dateOfTransaction);
      const endDate = new Date(dateOfTransaction);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    // Filter by userId
    if (userId) {
      filter.userId = userId;
    }
    // Filter by transactionAmount
    if (transactionAmount) {
      filter.transactionAmount = Number(transactionAmount);
    }

    // Find transactions matching filter
    const transactions = await Transaction.find(filter);
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

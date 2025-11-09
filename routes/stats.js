// routes/stats.js (new file)
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ScratchCard = require('../models/ScratchCard');
const Transaction = require('../models/Transaction');

router.get('/system', async (req, res) => {
  try {
    const now = new Date();
    const [
      totalUsers,
      activeUsers,
      totalScratchCards,
      unusedScratchCards,
      expiredScratchCards,
      usedScratchCards,
      totalTransactions,
      totalDiscountGiven
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      ScratchCard.countDocuments({}),
      ScratchCard.countDocuments({ isActive: true, isScratched: false, expiryDate: { $gt: now } }),
      ScratchCard.countDocuments({ isActive: true, isScratched: false, expiryDate: { $lte: now } }),
      ScratchCard.countDocuments({ isScratched: true }),
      Transaction.countDocuments({}),
      Transaction.aggregate([
        { $group: { _id: null, sum: { $sum: "$transactionAmount" } } }
      ])
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalScratchCards,
      unusedScratchCards,
      expiredScratchCards,
      usedScratchCards,
      totalTransactions,
      totalDiscountGiven: (totalDiscountGiven[0]?.sum || 0)
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const ScratchCard = require('../models/ScratchCard');
const { v4: uuidv4 } = require('uuid');

// Generate N scratch cards
router.post('/generate', async (req, res) => {
  try {
    const N = Number(req.body.numberOfScratchCards);
    if (!N || N < 1) {
      return res.status(400).json({ message: 'Invalid numberOfScratchCards' });
    }

    const now = new Date();
    const unusedCriteria = {
      isActive: true,
      isScratched: false,
      expiryDate: { $gt: now }
    };

    const existingCount = await ScratchCard.countDocuments(unusedCriteria);
    if (existingCount >= N) {
      return res.status(200).json({
        message: `${existingCount} number of active scratch cards still exists in the DB. Did not create any new scratch cards`
      });
    }

    const cardsToCreate = N;
    let newCards = [];
    for (let i = 0; i < cardsToCreate; i++) {
      const discountAmount = Math.floor(Math.random() * 1001); // 0-1000 inclusive
      const expiryDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
      newCards.push({
        id: uuidv4(),
        discountAmount,
        expiryDate,
        isScratched: false,
        isActive: true
      });
    }
    const created = await ScratchCard.insertMany(newCards);
    res.status(201).json({ cards: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const ScratchCard = require('../models/ScratchCard');
const mongoose = require('mongoose');


//Create_new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Get_all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get_user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Update_user by ID
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Delete_user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:id/scratch-cards', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    // transactions by this user
    const txs = await Transaction.find({ userId: id }).lean();
    const usedIds = txs.map(t => t.scratchCardId);

    const usedCards = usedIds.length
      ? await ScratchCard.find({ id: { $in: usedIds } })
      : [];

    // Optionally also return currently available global unused cards (if you want to help the UI)
    const now = new Date();
    const activeUnusedGlobal = await ScratchCard.find({
      isActive: true, isScratched: false, expiryDate: { $gt: now }
    }).limit(50); // prevent huge payloads

    res.json({
      usedCards,
      activeUnusedCardsGlobal: activeUnusedGlobal
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

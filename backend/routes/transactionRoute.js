const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { TransactionModel } = require('../models/TransactionModel');
const router = express.Router();

// create
router.post(
  '/',
  [
    body('type').isIn(['income', 'expense']),
    body('amount').isNumeric(),
    body('description').optional().isString(),
    body('category').optional().isString(),
    body('date').optional().isISO8601(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array });
    try {
      const tx = new TransactionModel(req.body);
      await tx.save();
      res.status(201).json(tx);
    } catch (err) {
      next(err);
    }
  }
);

// Read (with filters)
router.get(
  '/',
  [
    // optional query validation
  ],
  async (req, res, next) => {
    try {
      const {
        type,
        category,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = req.query;
      const filter = {};
      if (type) filter.type = type;
      if (category) filter.category = category;
      if (startDate || endDate) filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);

      const transactions = await TransactionModel.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await TransactionModel.countDocuments(filter);
      res.json({ data: transactions, total });
    } catch (err) {
      next(err);
    }
  }
);

// Get one
router.get('/:id', async (req, res, next) => {
  try {
    const tx = await TransactionModel.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) {
    next(err);
  }
});

// Update
router.put(
  '/:id',
  [
    body('type').optional().isIn(['income', 'expense']),
    body('amount').optional().isNumeric(),
    body('date').optional().isISO8601(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const tx = await TransactionModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!tx) return res.status(404).json({ message: 'Not found' });
      res.json(tx);
    } catch (err) {
      next(err);
    }
  }
);

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const tx = await TransactionModel.findByIdAndDelete(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

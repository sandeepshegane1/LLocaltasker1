import express from 'express';
import Review from '../models/Review.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a user
router.get('/:userId', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a review
router.post('/', auth, async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      reviewer: req.user._id
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
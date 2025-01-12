import express from 'express';
import Review from '../models/Review.js';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a provider by service category
router.get('/provider/:providerId', async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const serviceCategory = req.query.category;

    const query = { provider: providerId };
    
    // Add category filter if provided
    if (serviceCategory) {
      query.serviceCategory = serviceCategory;
    }

    const reviews = await Review.find(query)
      .populate('client', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching provider reviews:', error);
    res.status(500).json({ error: 'Failed to fetch provider reviews' });
  }
});

// Get review stats for a provider
router.get('/provider/:providerId/stats', auth, async (req, res) => {
  try {
    const { category } = req.query;
    const query = {
      provider: req.params.providerId,
      ...(category && { serviceCategory: category })
    };

    const stats = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1,
          ratingDistribution: {
            5: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 5] } } } },
            4: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 4] } } } },
            3: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 3] } } } },
            2: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 2] } } } },
            1: { $size: { $filter: { input: '$ratings', cond: { $eq: ['$$this', 1] } } } }
          }
        }
      }
    ]);

    res.json(stats[0] || { 
      averageRating: 0, 
      totalReviews: 0, 
      ratingDistribution: { 
        5: 0, 
        4: 0, 
        3: 0, 
        2: 0, 
        1: 0 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get provider stats (average rating and review count) by category
router.get('/provider-stats/:providerId', async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const serviceCategory = req.query.category;
    
    const matchQuery = {
      provider: new mongoose.Types.ObjectId(providerId)
    };

    // Add category filter if provided
    if (serviceCategory) {
      matchQuery.serviceCategory = serviceCategory;
    }
    
    const stats = await Review.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$provider',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    // If no reviews found, return default values
    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0
      });
    }

    res.json({
      averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: stats[0].totalReviews
    });
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    res.status(500).json({ error: 'Failed to fetch provider stats' });
  }
});

// Get all reviews created by the current user
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ client: req.user._id })
      .populate('provider', 'name')
      .populate('task', 'title description')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a review
router.post('/', auth, async (req, res) => {
  try {
    const { task, provider, rating, comment, serviceCategory } = req.body;

    // Debug logging
    console.log('Received review data:', {
      task,
      provider,
      rating,
      comment,
      serviceCategory,
      client: req.user._id
    });

    // Check if user has already reviewed this task
    const existingReview = await Review.findOne({
      task,
      client: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this task' });
    }

    const review = new Review({
      client: req.user._id,
      provider,
      task,
      rating,
      comment,
      serviceCategory
    });

    // Debug logging
    console.log('Created review object:', review);

    await review.save();

    // Populate client information
    await review.populate('client', 'name');

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
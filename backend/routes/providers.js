import express from 'express';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { analyzeSentiment, calculateProviderPriority } from '../utils/sentimentAnalysis.js';

const router = express.Router();

// Get prioritized service providers
router.get('/prioritized', async (req, res) => {
  try {
    const { serviceCategory } = req.query;

    // Find all providers for the given service category
    const providers = await User.find({
      role: 'provider',
      serviceCategories: serviceCategory
    }).populate('reviews');

    // Calculate priority scores and add them to provider objects
    const providersWithPriority = providers.map(provider => ({
      ...provider.toObject(),
      priorityScore: calculateProviderPriority(provider)
    }));

    // Sort providers by priority score
    const sortedProviders = providersWithPriority.sort(
      (a, b) => b.priorityScore - a.priorityScore
    );

    res.json(sortedProviders);
  } catch (error) {
    console.error('Error fetching prioritized providers:', error);
    res.status(500).json({ message: 'Error fetching providers' });
  }
});

// Add sentiment analysis to new reviews
router.post('/review', async (req, res) => {
  try {
    const { providerId, comment, rating, taskId } = req.body;
    const clientId = req.user.id; // Assuming you have authentication middleware

    // Analyze sentiment of the comment
    const sentiment = analyzeSentiment(comment);

    // Create new review with sentiment
    const review = new Review({
      client: clientId,
      provider: providerId,
      task: taskId,
      rating,
      comment,
      sentiment
    });

    await review.save();

    // Update provider's average rating
    const providerReviews = await Review.find({ provider: providerId });
    const averageRating = providerReviews.reduce((sum, review) => sum + review.rating, 0) / providerReviews.length;

    await User.findByIdAndUpdate(providerId, { 
      $set: { rating: averageRating },
      $push: { reviews: review._id }
    });

    res.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
});

export default router;

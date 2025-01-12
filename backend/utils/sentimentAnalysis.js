import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

export const analyzeSentiment = async (text) => {
  if (!text) return 'neutral';

  try {
    // Using a pre-trained sentiment analysis model
    const result = await hf.textClassification({
      model: 'nlptown/bert-base-multilingual-uncased-sentiment',
      inputs: text,
    });

    // The model returns scores from 1 to 5
    // Convert the score to our sentiment categories
    const score = parseInt(result[0].label.charAt(0));
    
    if (score >= 4) return 'positive';
    if (score <= 2) return 'negative';
    return 'neutral';
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return 'neutral';
  }
};

export const calculateProviderPriority = (provider) => {
  const {
    rating = 0,
    reviews = [],
    completedTasks = 0,
    responseRate = 0
  } = provider;

  // Calculate sentiment score
  const sentimentScore = reviews.reduce((score, review) => {
    switch (review.sentiment) {
      case 'positive': return score + 1;
      case 'negative': return score - 1;
      default: return score;
    }
  }, 0) / (reviews.length || 1);

  // Calculate recency score (prioritize recent reviews more)
  const recentReviews = reviews
    .filter(review => {
      const reviewDate = new Date(review.createdAt);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return reviewDate >= threeMonthsAgo;
    })
    .length;

  const recentScore = recentReviews / (reviews.length || 1);

  // Calculate final priority score
  const priorityScore = (
    (rating * 0.35) + // 35% weight to rating
    (sentimentScore * 0.30) + // 30% weight to sentiment
    (recentScore * 0.20) + // 20% weight to recency
    ((responseRate / 100) * 0.10) + // 10% weight to response rate
    ((completedTasks / 100) * 0.05) // 5% weight to completed tasks
  );

  return priorityScore;
};

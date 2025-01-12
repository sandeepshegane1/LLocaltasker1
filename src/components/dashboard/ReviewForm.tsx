import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';

interface ReviewFormProps {
  taskId: string;
  providerId: string;
  serviceCategory: string;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

interface TaskDetails {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  provider: {
    _id: string;
    name: string;
  } | null;
}

export function ReviewForm({ taskId, providerId, serviceCategory, onClose, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching task details for ID:', taskId);
        const response = await api.get(`/tasks/${taskId}`);
        console.log('Task details response:', response.data);
        
        if (!response.data) {
          throw new Error('No task data received');
        }
        
        setTaskDetails(response.data);
      } catch (error: any) {
        console.error('Error fetching task details:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Failed to load task details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: {
      taskId: string;
      providerId: string;
      rating: number;
      comment: string;
      serviceCategory: string;
    }) => {
      // Log the data being sent
      console.log('Submitting review with data:', reviewData);

      try {
        const response = await api.post('/reviews', {
          task: reviewData.taskId,
          provider: reviewData.providerId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          serviceCategory: reviewData.serviceCategory
        });
        return response.data;
      } catch (error: any) {
        // Enhanced error handling
        console.error('Review submission error:', error.response?.data || error);
        throw new Error(error.response?.data?.error || 'Failed to submit review');
      }
    },
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['provider-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      onClose();
    },
    onError: (error: any) => {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please provide a comment');
      return;
    }

    if (!taskDetails) {
      toast.error('Task details not available. Please try again.');
      return;
    }

    // Get provider ID either from props or task details
    const finalProviderId = providerId || taskDetails.provider?._id;
    const finalCategory = serviceCategory || taskDetails.category || 'General';

    // Validate required fields
    if (!finalProviderId) {
      toast.error('Provider information is missing. Please try again.');
      return;
    }

    if (!taskId) {
      toast.error('Task information is missing. Please try again.');
      return;
    }

    try {
      await submitReviewMutation.mutateAsync({
        taskId,
        providerId: finalProviderId,
        rating,
        comment,
        serviceCategory: finalCategory
      });
    } catch (error) {
      // Error is handled by mutation's onError
      console.error('Review submission failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <p className="text-center text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
        {taskDetails && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <p className="font-medium text-gray-800">{taskDetails.title}</p>
            <p className="text-sm text-gray-600 mt-1">Provider: {taskDetails.provider?.name || 'Unknown Provider'}</p>
            <p className="text-sm text-gray-600">Category: {taskDetails.category || 'General'}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Comment
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
              disabled={submitReviewMutation.isPending || !taskDetails}
            >
              {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

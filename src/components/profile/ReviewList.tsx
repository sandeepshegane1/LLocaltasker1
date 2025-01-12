import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../lib/axios';

interface ReviewListProps {
  userId: string;
  tasksCount?: number;
}

export function ReviewList({ userId, tasksCount = 0 }: ReviewListProps) {
  const [showReviews, setShowReviews] = useState(false);

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['reviews', userId],
    queryFn: async () => {
      const response = await api.get(`/reviews/provider/${userId}`);
      return response.data;
    },
    enabled: !!userId
  });

  const averageRating = reviews?.length > 0
    ? (reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-600">
        Failed to load reviews. Please try again later.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button 
        onClick={() => setShowReviews(!showReviews)}
        className="w-full flex items-center gap-2 mb-6 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
      >
        <div className="flex flex-1 items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Number(averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-700">{averageRating}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-700">({reviews?.length || 0} reviews)</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-700">({tasksCount} {tasksCount === 1 ? 'task' : 'tasks'})</span>
        </div>
        {reviews?.length > 0 && (
          <div className="text-gray-500">
            {showReviews ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        )}
      </button>

      {showReviews && (
        <div className="mt-4">
          {(!reviews || reviews.length === 0) ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review: any) => (
                <div key={review._id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {review.reviewer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {review.reviewer.name}
                        </h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
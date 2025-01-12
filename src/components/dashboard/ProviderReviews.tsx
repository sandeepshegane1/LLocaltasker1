import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import api from '../../lib/axios';

interface Props {
  providerId: string;
  serviceCategory?: string;
}

export function ProviderReviews({ providerId, serviceCategory }: Props) {
  // Fetch reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['provider-reviews', providerId, serviceCategory],
    queryFn: async () => {
      const response = await api.get(`/reviews/provider/${providerId}${serviceCategory ? `?category=${serviceCategory}` : ''}`);
      return response.data;
    },
  });

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-4">
      {isReviewsLoading ? (
        <div className="text-gray-600">Loading reviews...</div>
      ) : reviews?.length > 0 ? (
        reviews.map((review: any) => (
          <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {review.client?.name || 'Anonymous'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
            {!serviceCategory && (
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                  {review.serviceCategory}
                </span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-600">
          No reviews yet for {serviceCategory ? serviceCategory : 'this provider'}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import api from '../../lib/axios';

interface ReviewListProps {
  userId: string;
}

export function ReviewList({ userId }: ReviewListProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', userId],
    queryFn: async () => {
      const response = await api.get(`/reviews/${userId}`);
      return response.data;
    }
  });

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Reviews</h3>
      <div className="space-y-6">
        {reviews?.map((review: any) => (
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
    </div>
  );
}
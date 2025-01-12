import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import api from '../../lib/axios';

interface ProviderStatsProps {
  providerId: string;
  category?: string;
}

export function ProviderStats({ providerId, category }: ProviderStatsProps) {
  // Fetch provider stats
  const { data: stats } = useQuery({
    queryKey: ['provider-stats', providerId, category],
    queryFn: async () => {
      const response = await api.get(`/reviews/provider-stats/${providerId}${category ? `?category=${category}` : ''}`);
      return response.data;
    },
    initialData: { averageRating: 0, totalReviews: 0 }
  });

  // Fetch provider tasks count
  const { data: tasksCount } = useQuery({
    queryKey: ['provider-tasks-count', providerId, category],
    queryFn: async () => {
      const response = await api.get(`/tasks/provider/${providerId}/completed-count${category ? `?category=${category}` : ''}`);
      return response.data.count;
    },
    initialData: 0
  });

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <div className="flex items-center">
        <div className="flex items-center">
          {renderStars(stats.averageRating)}
        </div>
        <span className="ml-2 font-medium">
          {stats.averageRating.toFixed(1)}
        </span>
      </div>
      <span>•</span>
      <span>
        ({stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'})
      </span>
      <span>•</span>
      <span>
        ({tasksCount} {tasksCount === 1 ? 'task' : 'tasks'})
      </span>
    </div>
  );
}

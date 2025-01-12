import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, MessageSquare } from 'lucide-react';
import api from '../../lib/axios';
import { ReviewForm } from './ReviewForm';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'COMPLETED';
  budget: number;
  category: string;
  provider: {
    _id: string;
    name: string;
  };
  createdAt: string;
  completedAt: string;
}

interface Review {
  _id: string;
  task: string;
  rating: number;
  comment: string;
}

export function CompletedTasks() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['completed-tasks'],
    queryFn: async () => {
      const response = await api.get('/tasks/completed');
      return response.data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ['task-reviews'],
    queryFn: async () => {
      const response = await api.get('/reviews/my-reviews');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-20 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  const hasReview = (taskId: string) => {
    return reviews?.some((review: Review) => review.task === taskId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Completed Tasks</h2>
      <div className="grid gap-6">
        {tasks?.map((task: Task) => (
          <div key={task._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Completed on {new Date(task.completedAt).toLocaleDateString()}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-600">Provider: </span>
                  <span className="text-sm text-gray-900">{task.provider.name}</span>
                </div>
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-600">Budget: </span>
                  <span className="text-sm text-gray-900">${task.budget}</span>
                </div>
              </div>
              {!hasReview(task._id) && (
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowReviewForm(true);
                  }}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Add Review
                </button>
              )}
              {hasReview(task._id) && (
                <div className="flex items-center text-emerald-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reviewed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showReviewForm && selectedTask && (
        <ReviewForm
          taskId={selectedTask._id}
          providerId={selectedTask.provider._id}
          serviceCategory={selectedTask.category}
          onClose={() => {
            setShowReviewForm(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}

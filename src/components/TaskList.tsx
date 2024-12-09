import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

export function TaskList() {
  const user = useAuthStore((state) => state.user);
  
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/tasks');
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      {tasks?.map((task: any) => (
        <div
          key={task.id}
          className="bg-white shadow rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <p className="mt-1 text-gray-500">{task.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              {task.status}
            </span>
            <span className="text-sm text-gray-500">
              Budget: ${task.budget}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
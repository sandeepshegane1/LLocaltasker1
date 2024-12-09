import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, DollarSign, MapPin, CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import Notification from '../../components/Notification';

interface User {
  _id: string;
  name: string;
  email: string;
  location?: { lat: number; lng: number };
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'ASSIGNED' | 'COMPLETED';
  budget: number;
  category: string;
  createdAt: string;
  provider?: { $oid: string } | string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1));
}

export function ProviderDashboard() {
  const user = useAuthStore((state) => state.user) as User | null;
  const [activeTab, setActiveTab] = useState<'open' | 'assigned' | 'completed'>('open');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to get your current location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  }, []);

  if (!user) {
    toast.error('User is not authenticated');
    return null;
  }

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['provider-tasks', activeTab, user._id, currentLocation],
    queryFn: async () => {
      const response = await api.get('/tasks/provider', {
        params: {
          status: activeTab === 'open' ? 'OPEN' : 
                  activeTab === 'assigned' ? 'ASSIGNED' : 
                  'COMPLETED',
        },
      });
      return response.data
        .filter((task: Task) => {
          const taskProviderId = typeof task.provider === 'object' && task.provider?.$oid 
            ? task.provider.$oid 
            : task.provider;
          
          return taskProviderId === user._id;
        })
        .map((task: Task) => ({
          ...task,
          distance: currentLocation
            ? calculateDistance(
                currentLocation.lat,
                currentLocation.lng,
                task.location.coordinates[1],
                task.location.coordinates[0]
              )
            : null
        }));
    },
    onError: (error) => {
      console.error('Failed to fetch tasks:', error);
      setNotification({ message: 'Failed to load tasks', type: 'error' });
    },
    enabled: !!currentLocation,
  });
  
  const acceptTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { 
        status: 'ASSIGNED', 
        provider: user._id 
      });
      setNotification({ message: 'Task accepted successfully', type: 'success' });
      queryClient.invalidateQueries(['provider-tasks']);
    } catch (error) {
      console.error('Failed to accept task:', error);
      setNotification({ message: 'Failed to accept task', type: 'error' });
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: 'COMPLETED' });
      setNotification({ message: 'Task completed successfully', type: 'success' });
      queryClient.invalidateQueries(['provider-tasks']);
    } catch (error) {
      console.error('Failed to complete task:', error);
      setNotification({ message: 'Failed to complete task', type: 'error' });
    }
  };

  const rejectTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setNotification({ message: 'Task rejected successfully', type: 'success' });
      queryClient.invalidateQueries(['provider-tasks']);
    } catch (error) {
      console.error('Failed to reject task:', error);
      setNotification({ message: 'Failed to reject task', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 text-center p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="mb-4">Failed to load tasks. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Reload
        </button>
      </div>
    );
  }

  const filteredTasks = tasks || [];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {activeTab === 'open' ? 'Open Tasks' : 
               activeTab === 'assigned' ? 'Assigned Tasks' : 
               'Completed Tasks'}
            </h1>
            <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
              {[
                { key: 'open', label: 'Open', color: 'emerald' }, 
                { key: 'assigned', label: 'Assigned', color: 'blue' }, 
                { key: 'completed', label: 'Completed', color: 'green' }
              ].map(({ key, label, color }) => (
                <button 
                  key={key} 
                  onClick={() => setActiveTab(key as typeof activeTab)} 
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    activeTab === key 
                      ? `bg-${color}-600 text-white` 
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-gray-100 rounded-lg">
              <CheckCircle className="mx-auto w-16 h-16 text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No tasks found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task: Task & { distance: number | null }) => (
                <div 
                  key={task._id} 
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800 truncate mr-2">{task.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' :
                        task.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="text-sm">Posted {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <DollarSign className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="text-sm">Budget: ${task.budget}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="text-sm">
                          {task.distance !== null 
                            ? `${task.distance} km away` 
                            : 'Distance unavailable'}
                        </span>
                      </div>
                    </div>
                    {activeTab === 'open' && task.status === 'OPEN' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => acceptTask(task._id)} 
                          className="flex-1 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-semibold"
                        >
                          Accept Task
                        </button>
                        <button 
                          onClick={() => rejectTask(task._id)} 
                          className="px-3 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          aria-label="Reject Task"
                        >
                          Reject Task
                        </button>
                      </div>
                    )}
                    {activeTab === 'assigned' && task.status === 'ASSIGNED' && (
                      <button 
                        onClick={() => completeTask(task._id)} 
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}

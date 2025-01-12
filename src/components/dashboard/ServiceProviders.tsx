import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Star, MapPin, Calendar, Info, Crosshair } from 'lucide-react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { calculateDistance } from '../../utils/distance';
import { ProviderReviews } from './ProviderReviews';
import { ProviderStats } from './ProviderStats';

// Interfaces (updated)
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER';
}

interface ProviderStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

interface ServiceProvider extends User {
  category?: string;
  skills?: string[];
  rating?: number;
  completedTasks?: number;
  location?: {
    type: string;
    coordinates: number[];
  };
  stats?: ProviderStats;
  reviewsCount?: number;
}

interface Task {
  _id?: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  client: string;
  provider: string;
  location: {
    type: string;
    coordinates: number[];
  };
  deadline?: Date;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface TaskFormData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

// Utility Components (unchanged)
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-solid"></div>
  </div>
);

const ProviderAvatar = ({ name }: { name: string }) => (
  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-md">
    <span className="text-emerald-600 font-bold text-lg uppercase">
      {name.charAt(0)}
    </span>
  </div>
);

// Reusable Form Input Component (unchanged)
const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  step
}: {
  label: string;
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  step?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

// Provider Card Component (new)
function ProviderCard({ provider, onSelect }: { provider: ServiceProvider; onSelect: () => void }) {
  const { category } = useParams<{ category: string }>();
  const { data: stats } = useQuery({
    queryKey: ['provider-stats', provider._id, category],
    queryFn: async () => {
      const response = await api.get(`/reviews/provider/${provider._id}/stats?category=${category}`);
      return response.data;
    },
  });

  const { data: tasksData } = useQuery({
    queryKey: ['provider-tasks', provider._id],
    queryFn: async () => {
      const response = await api.get(`/tasks/provider/${provider._id}/completed`);
      return response.data;
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <ProviderAvatar name={provider.name} />
          <div className="ml-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
              <ProviderStats providerId={provider._id} category={category} />
            </div>
          </div>
        </div>
      </div>

      {provider.skills && provider.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {provider.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={onSelect}
          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Select Provider
        </button>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Reviews</h4>
          <button
            onClick={() => setShowReviews(prev => ({
              ...prev,
              [provider._id]: !prev[provider._id]
            }))}
            className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {showReviews[provider._id] ? 'Hide Reviews' : 'Show Reviews'}
          </button>
        </div>
        {showReviews[provider._id] && (
          <div className="mt-4">
            <ProviderReviews 
              providerId={provider._id} 
              serviceCategory={category || ''}
              hideStats={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function ServiceProviders() {
  const { category } = useParams<{ category: string }>();
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    budget: 0,
    deadline: '',
    priority: 'LOW',
    location: {
      latitude: null,
      longitude: null
    }
  });
  const [formErrors, setFormErrors] = useState<Partial<TaskFormData>>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [clientLocation, setClientLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showReviews, setShowReviews] = useState<{ [key: string]: boolean }>({});

  // Authentication and data fetching logic (unchanged)
  const { user: clientUser, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));

  const { data: providers, isLoading: isProvidersLoading, error } = useQuery<ServiceProvider[]>({
    queryKey: ['providers', category],
    queryFn: async () => {
      const response = await api.get(`/users/providers?category=${category?.toUpperCase()}`);
      const providers = response.data;

      // Fetch stats for each provider
      const providersWithStats = await Promise.all(
        providers.map(async (provider) => {
          try {
            const [statsResponse, tasksResponse] = await Promise.all([
              api.get(`/reviews/provider/${provider._id}/stats?category=${category}`),
              api.get(`/tasks/provider/${provider._id}/completed`)
            ]);
            
            return {
              ...provider,
              rating: statsResponse.data.averageRating || 0,
              reviewsCount: statsResponse.data.totalReviews || 0,
              completedTasks: tasksResponse.data.count || 0
            };
          } catch (error) {
            console.error('Error fetching provider stats:', error);
            return provider;
          }
        })
      );

      return providersWithStats;
    },
    enabled: isAuthenticated && !!clientUser?._id
  });

  const createTaskMutation = useMutation<Task, Error, Task>({
    mutationFn: async (taskData) => {
      const response = await api.post('/tasks', taskData);
      return response.data;
    },
    onSuccess: (data) => {
      alert(`Task created successfully with ID: ${data._id}`);
      resetForm();
    },
    onError: (error) => {
      console.error(error);
      alert('Failed to create task');
    },
  });

  // Geolocation function
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTaskFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Failed to get your location. Please try again.");
          setIsGettingLocation(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setClientLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  }, []);

  // Validation method (updated)
  const validateForm = (): boolean => {
    const errors: Partial<TaskFormData> = {};

    if (!taskFormData.title.trim()) errors.title = 'Title is required';
    if (!taskFormData.description.trim()) errors.description = 'Description is required';
    if (taskFormData.budget <= 0) errors.budget = 'Budget must be greater than zero';
    if (!taskFormData.deadline) errors.deadline = 'Deadline is required';
    if (taskFormData.location.latitude === null || taskFormData.location.longitude === null) {
      errors.location = 'Location is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Task submission handler (updated)
  const handleSubmitTask = (provider: ServiceProvider) => {
    if (validateForm()) {
      const taskData: Task = {
        title: taskFormData.title,
        description: taskFormData.description,
        budget: taskFormData.budget,
        category: category || '',
        client: clientUser?._id || '',
        provider: provider._id,
        location: {
          type: 'Point',
          coordinates: [
            taskFormData.location.longitude!,  // GeoJSON format: [longitude, latitude]
            taskFormData.location.latitude!
          ]
        },
        deadline: new Date(taskFormData.deadline)
      };

      createTaskMutation.mutate(taskData);
    }
  };

  // Form reset method (unchanged)
  const resetForm = () => {
    setTaskFormData({
      title: '',
      description: '',
      budget: 0,
      deadline: '',
      priority: 'LOW',
      location: {
        latitude: null,
        longitude: null
      }
    });
    setFormErrors({});
  };

  // Input change handler (unchanged)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setTaskFormData(prev => {
      if (name === 'budget') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render methods (updated)
  if (isProvidersLoading) return <LoadingSpinner />;

  if (error) return (
    <div className="text-center p-6 bg-red-50">
      <Info className="mx-auto mb-4 text-red-500" size={48} />
      <p className="text-red-600">Error loading service providers. Please try again later.</p>
    </div>
  );

  if (providers?.length === 0) return (
    <div className="text-center p-6 bg-gray-50">
      <Info className="mx-auto mb-4 text-gray-500" size={48} />
      <p className="text-gray-600">No service providers found in this category.</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-emerald-800">
        Service Providers - {category?.replace('_', ' ')}
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {providers?.map((provider) => (
          <div 
            key={provider._id}
            className="bg-white rounded-lg shadow-lg p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <ProviderAvatar name={provider.name} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <ProviderStats providerId={provider._id} category={category} />
                  </div>
                </div>
              </div>
              {/* Right Column: Provider Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                <span>
                  {provider.location?.coordinates && clientLocation
                    ? `${calculateDistance(
                        clientLocation.latitude,
                        clientLocation.longitude,
                        provider.location.coordinates[1],
                        provider.location.coordinates[0]
                      )} km away`
                    : 'Distance not available'}
                </span>
              </div>
            </div>
            
            {/* Task Form Section */}
            <div className="border-t pt-6">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitTask(provider);
                }} 
                className="space-y-4"
              >
                {/* Task Title and Description */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                    <input
                      type="text"
                      name="title"
                      value={taskFormData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter task title"
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={taskFormData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 ${
                        formErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe your task in detail"
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                    )}
                  </div>
                </div>

                {/* Budget and Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                      <span className="text-xs text-gray-500 ml-1">(INR)</span>
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={taskFormData.budget}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 ${
                        formErrors.budget ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="₹0.00"
                      step="100"
                      min="0"
                    />
                    {formErrors.budget && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.budget}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline
                      <span className="text-xs text-gray-500 ml-1">(Select date)</span>
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={taskFormData.deadline}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 ${
                        formErrors.deadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.deadline && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.deadline}</p>
                    )}
                  </div>
                </div>

                {/* Location and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex items-center justify-center w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Crosshair className="w-5 h-5 mr-2" />
                      {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                    </button>
                    {locationError && (
                      <p className="text-red-500 text-xs mt-1">{locationError}</p>
                    )}
                    {taskFormData.location.latitude !== null && taskFormData.location.longitude !== null && (
                      <p className="text-sm text-gray-600 mt-1">
                        Location set: {taskFormData.location.latitude.toFixed(4)}, {taskFormData.location.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={taskFormData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="LOW">Low Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="HIGH">High Priority</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createTaskMutation.isPending}
                  className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createTaskMutation.isPending ? 'Creating Task...' : 'Create Task'}
                </button>
              </form>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Reviews</h4>
                <button
                  onClick={() => setShowReviews(prev => ({
                    ...prev,
                    [provider._id]: !prev[provider._id]
                  }))}
                  className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {showReviews[provider._id] ? 'Hide Reviews' : 'Show Reviews'}
                </button>
              </div>
              {showReviews[provider._id] && (
                <div className="mt-4">
                  <ProviderReviews 
                    providerId={provider._id} 
                    serviceCategory={category} 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

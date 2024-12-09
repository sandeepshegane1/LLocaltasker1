import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Star, MapPin, Calendar, Info, Crosshair } from 'lucide-react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { calculateDistance } from '../../utils/distance';

// Interfaces (unchanged)
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER';
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

export function ServiceProviders() {
  const { category } = useParams<{ category: string }>();
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    budget: 0,
    deadline: '',
    priority: 'MEDIUM',
    location: {
      latitude: null,
      longitude: null
    }
  });
  const [formErrors, setFormErrors] = useState<Partial<TaskFormData>>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [clientLocation, setClientLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Authentication and data fetching logic (unchanged)
  const { user: clientUser, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));

  const { data: providers, isLoading: isProvidersLoading, error } = useQuery<ServiceProvider[]>({
    queryKey: ['providers', category],
    queryFn: async () => {
      const response = await api.get(`/users/providers?category=${category?.toUpperCase()}`);
      return response.data;
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
            taskFormData.location.longitude!, 
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
      priority: 'MEDIUM',
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
            className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row p-6">
              {/* Left Column: Provider Info (unchanged) */}
              <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                <div className="flex items-center mb-4">
                  <ProviderAvatar name={provider.name} />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-emerald-900">{provider.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>
                        {provider.rating?.toFixed(1) || '4.8'} 
                        <span className="ml-1">
                          ({provider.completedTasks || 24} tasks)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Provider Details */}
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-emerald-500" />
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
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-emerald-500" />
                    <span>Available Mon-Fri, 9AM-5PM</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <h4 className="font-medium mb-3 text-emerald-800">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs"
                      >
                        {skill.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Task Creation Form (updated) */}
              <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 md:pl-6 pt-6 md:pt-0">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitTask(provider);
                  }} 
                  className="space-y-4"
                >
                  {/* Task Title */}
                  <FormInput 
                    label="Task Title"
                    type="text"
                    name="title"
                    value={taskFormData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    error={formErrors.title}
                  />

                  {/* Description */}
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

                  {/* Budget and Deadline */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput 
                      label="Budget"
                      type="number"
                      name="budget"
                      value={taskFormData.budget}
                      onChange={handleInputChange}
                      placeholder="$0.00"
                      error={formErrors.budget}
                    />
                    
                    <FormInput 
                      label="Deadline"
                      type="date"
                      name="deadline"
                      value={taskFormData.deadline}
                      onChange={handleInputChange}
                      error={formErrors.deadline}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Crosshair className="w-5 h-5 mr-2" />
                        {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                      </button>
                      {taskFormData.location.latitude !== null && taskFormData.location.longitude !== null && (
                        <span className="text-sm text-gray-600">
                          Location set: {taskFormData.location.latitude.toFixed(4)}, {taskFormData.location.longitude.toFixed(4)}
                        </span>
                      )}
                    </div>
                    {locationError && (
                      <p className="text-red-500 text-xs mt-1">{locationError}</p>
                    )}
                    {formErrors.location && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                    )}
                  </div>

                  {/* Priority Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={taskFormData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


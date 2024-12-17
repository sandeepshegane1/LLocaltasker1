import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, DollarSign, MapPin, CheckCircle, Trash2, X, Share2, Navigation, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useGeolocation } from '@/hooks/useGeolocation';

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

interface TaskNavigationMapProps {
  taskLocation: {
    lat: number;
    lng: number;
  };
  containerId: string;
}

const TaskNavigationMap: React.FC<TaskNavigationMapProps> = ({ taskLocation, containerId }) => {
  const { isLoaded, loadError } = useGoogleMaps();
  const { currentLocation } = useGeolocation();
  const [isMobile, setIsMobile] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Map container not found');
      return;
    }

    const mapInstance = new google.maps.Map(container, {
      zoom: 14,
      center: taskLocation,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });

    const renderer = new google.maps.DirectionsRenderer({
      map: mapInstance,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });

    setMap(mapInstance);
    setDirectionsRenderer(renderer);

    new google.maps.Marker({
      position: taskLocation,
      map: mapInstance,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#FF0000',
        fillOpacity: 0.8,
        strokeColor: 'white',
        strokeWeight: 2,
      },
      title: 'Task Location',
    });
  }, [isLoaded, loadError, containerId, taskLocation]);

  useEffect(() => {
    if (!map || !directionsRenderer || !currentLocation || !taskLocation) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: currentLocation,
        destination: taskLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
          
          const route = result.routes[0];
          if (route && route.legs.length > 0) {
            const leg = route.legs[0];
            setDistance(leg.distance?.text || '');
            setDuration(leg.duration?.text || '');
          }
        }
      }
    );
  }, [map, directionsRenderer, currentLocation, taskLocation]);

  const openInGoogleMaps = () => {
    if (!currentLocation) {
      toast.error('Please enable location services');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${taskLocation.lat},${taskLocation.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const shareLocation = async () => {
    if (!currentLocation) {
      toast.error('Please enable location services');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${taskLocation.lat},${taskLocation.lng}&travelmode=driving`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Task Location',
          text: 'Here is the route to the task location',
          url: url,
        });
        toast.success('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share');
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const copyMapLink = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${taskLocation.lat},${taskLocation.lng}&travelmode=driving`;
    copyToClipboard(url);
  };

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading map...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div id={containerId} className="flex-grow w-full rounded-lg overflow-hidden" />
      
      {/* Navigation Controls */}
      <div className="mt-2">
        <div className="bg-white rounded-lg shadow p-2">
          {/* Distance and Time Info */}
          {distance && duration && (
            <div className="mb-2 text-center">
              <p className="text-gray-700">
                <span className="font-semibold">{distance}</span> • 
                <span className="font-semibold ml-2">{duration}</span>
              </p>
            </div>
          )}
          
          {/* Control Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={openInGoogleMaps}
              className="flex flex-col items-center justify-center p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Navigation className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-xs text-blue-600 font-medium">Navigate</span>
            </button>
            
            <button
              onClick={shareLocation}
              className="flex flex-col items-center justify-center p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Share2 className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-xs text-purple-600 font-medium">Share</span>
            </button>
            
            <button
              onClick={copyMapLink}
              className="flex flex-col items-center justify-center p-2 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Copy className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-xs text-emerald-600 font-medium">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ProviderDashboard() {
  const user = useAuthStore((state) => state.user) as User | null;
  const [activeTab, setActiveTab] = useState<'open' | 'assigned' | 'completed'>('open');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const queryClient = useQueryClient();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

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

  useEffect(() => {
    if (selectedTaskId && showMap) {
      console.log('Attempting to show map for task:', selectedTaskId);
      // Use a longer delay to ensure the DOM has updated
      const timer = setTimeout(() => {
        const mapElement = document.getElementById(`map-container-${selectedTaskId}`);
        console.log('Map element found:', !!mapElement);
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [selectedTaskId, showMap]);

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

  const hasActiveTask = useMemo(() => {
    return tasks?.some((task: Task) => 
      task.status === 'ASSIGNED' && 
      (task.provider?._id === user?._id || task.provider === user?._id)
    ) ?? false;
  }, [tasks, user?._id]);

  useEffect(() => {
    if (!tasks) return;

    const filtered = tasks.filter((task: Task) => {
      switch (activeTab) {
        case 'open':
          // Only show open tasks if provider doesn't have an active task
          return task.status === 'OPEN' && !hasActiveTask;
        case 'assigned':
          const taskProviderId = task.provider?._id || task.provider;
          return task.status === 'ASSIGNED' && taskProviderId === user?._id;
        case 'completed':
          return task.status === 'COMPLETED' && 
            (task.provider?._id === user?._id || task.provider === user?._id);
        default:
          return false;
      }
    });

    console.log('Filtering tasks:', {
      total: tasks.length,
      filtered: filtered.length,
      activeTab,
      hasActiveTask
    });

    setFilteredTasks(filtered);
  }, [tasks, activeTab, user?._id, hasActiveTask]);

  useEffect(() => {
    setSelectedTaskId(null);
    setShowMap(false);
  }, [activeTab]);

  const acceptTask = async (taskId: string) => {
    try {
      // Check if provider already has an active task
      if (hasActiveTask) {
        setNotification({
          message: 'You already have an active task. Please complete it before accepting a new one.',
          type: 'error'
        });
        return;
      }

      console.log('Accepting task:', taskId);
      
      // First update UI state
      setSelectedTaskId(taskId);
      setShowMap(true);

      // Update local tasks state immediately
      setFilteredTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => 
          task._id === taskId 
            ? { ...task, status: 'ASSIGNED', provider: user?._id } 
            : task
        );
        console.log('Updated tasks locally:', updatedTasks);
        return updatedTasks;
      });

      // Then make the API call
      await api.patch(`/tasks/${taskId}`, { 
        status: 'ASSIGNED', 
        provider: user?._id 
      });

      // Switch to assigned tab
      setActiveTab('assigned');

      setNotification({
        message: 'Task accepted successfully',
        type: 'success'
      });

      // Invalidate queries after state updates
      queryClient.invalidateQueries(['provider-tasks']);
    } catch (error) {
      console.error('Failed to accept task:', error);
      setNotification({
        message: 'Failed to accept task',
        type: 'error'
      });
      // Reset UI state on error
      setSelectedTaskId(null);
      setShowMap(false);
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

  console.log('Rendering ProviderDashboard with:', {
    selectedTaskId,
    showMap,
    filteredTasks: filteredTasks?.length,
    tasks: tasks?.length
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg">
          {/* Dashboard Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Provider Dashboard</h1>
              <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
                <button 
                  onClick={() => setActiveTab('open')} 
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    activeTab === 'open' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Open Tasks
                </button>
                <button 
                  onClick={() => setActiveTab('assigned')} 
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    activeTab === 'assigned' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  My Tasks
                </button>
                <button 
                  onClick={() => setActiveTab('completed')} 
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    activeTab === 'completed' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex">
            {/* Task List */}
            <div className={`${showMap ? 'w-1/3' : 'w-full'} p-6 border-r`}>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-16 bg-gray-100 rounded-lg">
                  <CheckCircle className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-xl text-gray-600">
                    {activeTab === 'open' && (hasActiveTask 
                      ? 'Please complete your active task before accepting new tasks' 
                      : 'No open tasks available')}
                    {activeTab === 'assigned' && 'No tasks assigned to you'}
                    {activeTab === 'completed' && 'No completed tasks'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredTasks.map((task) => {
                    const isSelected = task._id === selectedTaskId;
                    const isAssignedToUser = task.status === 'ASSIGNED' && 
                      (task.provider?._id === user?._id || task.provider === user?._id);

                    return (
                      <div 
                        key={task._id} 
                        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800 truncate mr-2">
                              {task.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                task.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' :
                                task.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.status}
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                {task.category}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-gray-500">
                              <Clock className="w-5 h-5 mr-3 text-gray-400" />
                              <span className="text-sm">
                                Posted {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <DollarSign className="w-5 h-5 mr-3 text-gray-400" />
                              <span className="text-sm">Budget: ${task.budget}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                              <span className="text-sm">
                                {task.distance !== null 
                                  ? `${task.distance.toFixed(1)} km away` 
                                  : 'Distance unavailable'}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            {task.status === 'OPEN' && (
                              <>
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
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}

                            {isAssignedToUser && task.status !== 'COMPLETED' && (
                              <>
                                <button 
                                  onClick={() => completeTask(task._id)} 
                                  className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                                >
                                  Mark as Completed
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTaskId(task._id);
                                    setShowMap(true);
                                  }}
                                  className="px-3 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                  <MapPin className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Map Section */}
            {showMap && selectedTaskId && (
              <div className="w-2/3 relative">
                <div className="sticky top-0 h-[calc(100vh-4rem)]">
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => setShowMap(false)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                  {filteredTasks.map((task) => {
                    if (task._id !== selectedTaskId) return null;
                    return (
                      <div 
                        key={`map-${task._id}`}
                        className="h-full"
                      >
                        <div 
                          id={`map-container-${task._id}`} 
                          className="h-full w-full rounded-lg overflow-hidden bg-gray-100"
                        />
                        <TaskNavigationMap 
                          key={`map-${task._id}`}
                          taskLocation={{
                            lat: task.location.coordinates[1],
                            lng: task.location.coordinates[0]
                          }}
                          containerId={`map-container-${task._id}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

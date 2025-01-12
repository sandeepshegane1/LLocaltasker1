'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Star, Clock, Calendar, Edit2, X, Check, Tag, MessageSquare, MapPin } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import api from '../../lib/axios'
import { ReviewForm } from '../dashboard/ReviewForm'
import { ReviewList } from './ReviewList'
import { reverseGeocode } from '../../utils/geocoding'

interface UserData {
  _id: string
  name: string
  email: string
  role: string
  skills: string[]
  location: {
    type: string
    coordinates: [number, number]
  }
  createdAt: string
  updatedAt: string
}

interface Task {
  _id: string
  title: string
  description: string
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  rejectedByProvider?: boolean
  createdAt: string
  provider: {
    _id: string
    name: string
  }
  category: string
}

interface Review {
  _id: string
  task: Task
  rating: number
  comment: string
  createdAt: string
}

export function UserProfile() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [userTasks, setUserTasks] = useState<Task[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submittedReviews, setSubmittedReviews] = useState<Set<string>>(new Set())
  const [address, setAddress] = useState<string>('')

  const { register, handleSubmit, reset, watch } = useForm<UserData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'CLIENT',
      skills: user?.skills || [],
      location: user?.location || {
        type: 'Point',
        coordinates: [0, 0]
      },
      createdAt: user?.createdAt || '',
      updatedAt: user?.updatedAt || ''
    }
  });

  // Watch location coordinates for changes
  const coordinates = watch('location.coordinates');

  // Update address when coordinates change or component mounts
  useEffect(() => {
    const fetchAddress = async () => {
      // Get coordinates from form or user data
      const coords = coordinates || user?.location?.coordinates;
      
      if (coords && Array.isArray(coords) && coords.length === 2 && 
          (coords[0] !== 0 || coords[1] !== 0)) {
        try {
          console.log('Fetching address for coordinates:', coords);
          // Convert from [longitude, latitude] to [latitude, longitude] for reverse geocoding
          const addr = await reverseGeocode(coords[1], coords[0]);
          console.log('Received address:', addr);
          setAddress(addr || 'Location not found');
        } catch (error) {
          console.error('Error fetching address:', error);
          setAddress('Error fetching location');
        }
      } else {
        console.log('No valid coordinates found:', { coordinates, userLocation: user?.location });
        setAddress('No location set');
      }
    };

    fetchAddress();
  }, [coordinates, user?.location]);

  // Fetch user tasks only when user is a provider
  useEffect(() => {
    const fetchUserTasks = async () => {
      if (user?._id && user?.role === 'PROVIDER') {
        try {
          const response = await api.get('/tasks/provider');
          setUserTasks(response.data);
        } catch (error: any) {
          // Only show error if it's not a 401 error
          if (error.response?.status !== 401) {
            toast.error('Failed to load tasks');
          }
        }
      }
    };

    fetchUserTasks();
  }, [user?._id, user?.role]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const response = await api.get('/tasks/my-tasks')
        setUserTasks(response.data)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        //toast.error('Failed to fetch tasks')
      }
    }

    const fetchUserReviews = async () => {
      try {
        const response = await api.get('/reviews/my-reviews')
        setReviews(response.data)
        // Update submitted reviews set
        const reviewedTaskIds = new Set(response.data.map((review: Review) => review.task._id))
        setSubmittedReviews(reviewedTaskIds)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        toast.error('Failed to fetch reviews')
      }
    }

    fetchUserTasks()
    fetchUserReviews()
  }, [])

  const handleReviewClick = (task: Task) => {
    setSelectedTask(task)
    setShowReviewForm(true)
  }

  const handleReviewSubmitted = () => {
    setShowReviewForm(false)
    setSelectedTask(null)
    // Refresh reviews and tasks
    const fetchUpdates = async () => {
      try {
        const [tasksRes, reviewsRes] = await Promise.all([
          api.get('/tasks/my-tasks'),
          api.get('/reviews/my-reviews')
        ])
        setUserTasks(tasksRes.data)
        setReviews(reviewsRes.data)
        const reviewedTaskIds = new Set(reviewsRes.data.map((review: Review) => review.task._id))
        setSubmittedReviews(reviewedTaskIds)
      } catch (error) {
        console.error('Error fetching updates:', error)
      }
    }
    fetchUpdates()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'text-blue-600'
      case 'IN_PROGRESS':
        return 'text-yellow-600'
      case 'COMPLETED':
        return 'text-green-600'
      case 'CANCELLED':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="w-5 h-5" />
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5" />
      case 'COMPLETED':
        return <Check className="w-5 h-5" />
      case 'CANCELLED':
        return <X className="w-5 h-5" />
      default:
        return null
    }
  }

  const onSubmit = async (data: UserData) => {
    try {
      // Ensure coordinates are valid numbers and in the correct order [longitude, latitude]
      const coordinates = data.location.coordinates.map(Number);
      if (coordinates.some(isNaN)) {
        throw new Error('Invalid coordinates');
      }

      const updatedUser = await api.patch(`/users/profile`, {
        name: data.name,
        email: data.email,
        skills: data.skills,
        location: {
          type: 'Point',
          coordinates: coordinates // This is already in [longitude, latitude] order
        }
      });
      
      console.log('Profile update response:', updatedUser);
      updateUser(updatedUser.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusStyle = (status: string, rejectedByProvider?: boolean) => {
    if (status === 'CANCELLED' && rejectedByProvider) {
      return 'bg-red-100 text-red-800'
    }
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'OPEN':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (user?.role === 'CLIENT') {
        try {
          const [tasksResponse, reviewsResponse] = await Promise.all([
            api.get('/tasks/user-tasks'),
            api.get('/reviews/my-reviews')
          ]);
          setUserTasks(tasksResponse.data);
          setReviews(reviewsResponse.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          toast.error('Failed to fetch user data')
        }
      }
    }

    fetchUserTasks()
  }, [user?.role])

  return (
    <div className="w-full p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-5xl font-bold text-blue-600">
                {user?.name?.charAt(0)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-gray-600 mt-1">{user?.role === 'PROVIDER' ? 'Service Provider' : 'Client'}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    {...register('role')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="PROVIDER">Provider</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <input
                    {...register('skills')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">Enter skills separated by commas</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <p className="text-sm text-gray-500 mb-2">{address}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                    <input
                      {...register('location.coordinates.0')}
                      type="number"
                      step="any"
                      placeholder="Enter longitude"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                    <input
                      {...register('location.coordinates.1')}
                      type="number"
                      step="any"
                      placeholder="Enter latitude"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          // Store coordinates as [longitude, latitude] for MongoDB
                          const newCoordinates: [number, number] = [longitude, latitude];
                          reset({
                            ...watch(),
                            location: {
                              type: 'Point',
                              coordinates: newCoordinates
                            }
                          });
                          // Pass as [latitude, longitude] for reverse geocoding
                          reverseGeocode(latitude, longitude)
                            .then(addr => setAddress(addr))
                            .catch(error => {
                              console.error('Geocoding error:', error);
                              setAddress('Location found but address lookup failed');
                            });
                        },
                        (error) => {
                          console.error('Error getting location:', error);
                          toast.error('Unable to get your location. Please enter coordinates manually.');
                        }
                      );
                    } else {
                      toast.error('Geolocation is not supported by your browser');
                    }
                  }}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Current Location
                </button>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    reset()
                    setIsEditing(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">User Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {user?.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Role:</span> {user?.role}
                    </p>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      <span>{address || 'No location set'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" />
                      <span>Created: {formatDate(user?.createdAt || '')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                      <span>Last Updated: {formatDate(user?.updatedAt || '')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm lg:col-span-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-500" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user?.skills && user.skills.length > 0 ? (
                    user.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No skills listed</p>
                  )}
                </div>
              </div>

              {user?.role === 'PROVIDER' && (
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm lg:col-span-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    Booked Services
                  </h3>
                  {userTasks.length > 0 ? (
                    <div className="space-y-4">
                      {userTasks.map((task) => (
                        <div key={task._id} className="bg-white p-4 rounded-md shadow-sm">
                          <h4 className="font-medium text-gray-800">{task.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center space-x-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status, task.rejectedByProvider)}`}>
                                {task.status === 'CANCELLED' && task.rejectedByProvider ? 'Rejected' : task.status}
                              </span>
                              {task.provider?._id && (
                                <>
                                  {(() => {
                                    const reviewStatus = getReviewStatus(task);
                                    return (
                                      <div className="flex items-center">
                                        {reviewStatus.canReview ? (
                                          <button
                                            onClick={() => {
                                              setSelectedTask(task);
                                              setShowReviewForm(true);
                                            }}
                                            className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${reviewStatus.buttonStyle}`}
                                          >
                                            <Star className="w-3 h-3 mr-1" />
                                            {reviewStatus.message}
                                          </button>
                                        ) : (
                                          <span className={`flex items-center text-xs ${reviewStatus.buttonStyle}`}>
                                            <MessageSquare className="w-3 h-3 mr-1" />
                                            {reviewStatus.message}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(task.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No booked services found</p>
                  )}
                </div>
              )}
              {user?.role === 'PROVIDER' && (
                <ReviewList 
                  userId={user._id} 
                  tasksCount={userTasks.filter(task => task.status === 'COMPLETED').length}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {user?.role === 'CLIENT' && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Your Booked Tasks</h2>
              
              {userTasks.length > 0 ? (
                <div className="space-y-4">
                  {userTasks.map(task => {
                    const isReviewed = submittedReviews.has(task._id)
                    const review = reviews.find(r => r.task._id === task._id)
                    
                    return (
                      <div key={task._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium">{task.title}</h3>
                            <p className="text-gray-600">{task.description}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`flex items-center space-x-1 ${getStatusColor(task.status)}`}>
                                {getStatusIcon(task.status)}
                                <span>{task.status}</span>
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">
                                Provider: {task.provider?.name || 'Not assigned'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-600">No tasks booked yet</p>
              )}
            </div>
          </div>
        </div>
      )}
      {user?.role === 'CLIENT' && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
        </div>
      )}
      {user?.role === 'CLIENT' && (
        <>
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Pending Reviews
            </h3>
            {userTasks.filter(task => 
              task.status === 'COMPLETED' && !submittedReviews.has(task._id)
            ).length > 0 ? (
              <div className="space-y-4">
                {userTasks
                  .filter(task => task.status === 'COMPLETED' && !submittedReviews.has(task._id))
                  .map((task) => (
                    <div key={task._id} className="bg-white p-4 rounded-md shadow-sm">
                      <h4 className="font-medium text-gray-800">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
                            {task.status}
                          </span>
                          <button
                            onClick={() => handleReviewClick(task)}
                            className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full text-xs font-medium transition-colors"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Leave Review
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(task.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No pending reviews</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-6 shadow-sm lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-blue-500" />
              Your Submitted Reviews
            </h3>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => {
                  return (
                    <div key={review._id} className="bg-white p-6 rounded-md shadow-sm">
                      {/* Task Information */}
                      <div className="mb-5">
                        <h4 className="text-xl font-semibold text-gray-800 mb-3">
                          Task: {review.task?.title}
                        </h4>
                        <p className="text-lg text-gray-700">
                          {review.task?.description}
                        </p>
                        {review.task?.provider && (
                          <p className="text-lg text-gray-600 mt-3">
                            Provider: <span className="font-medium">{review.task.provider.name}</span>
                          </p>
                        )}
                      </div>

                      {/* Date */}
                      <div className="mb-5">
                        <div className="text-lg text-gray-600">
                          <span className="font-medium">Task Date:</span> {formatDate(review.task?.createdAt || '')}
                        </div>
                        <div className="text-lg text-gray-600 mt-2">
                          <span className="font-medium">Review Date:</span> {formatDate(review.createdAt)}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="mb-5">
                        <div className="flex items-center">
                          <span className="text-lg font-medium text-gray-700 mr-3">Rating:</span>
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-7 h-7 ${
                                index < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review */}
                      <div>
                        <span className="text-lg font-medium text-gray-700 mb-3 block">Review:</span>
                        <div className="bg-gray-50 p-5 rounded-md">
                          <p className="text-lg text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews submitted yet</p>
            )}
          </div>
        </>
      )}
      {showReviewForm && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <ReviewForm
              taskId={selectedTask._id}
              providerId={selectedTask.provider._id}
              serviceCategory={selectedTask.category}
              onClose={() => {
                setShowReviewForm(false)
                setSelectedTask(null)
              }}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  )
}

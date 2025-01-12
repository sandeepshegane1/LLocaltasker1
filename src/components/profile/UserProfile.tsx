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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {isEditing ? (
                    <input
                      {...register('name')}
                      className="w-full px-3 py-2 rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-800"
                    />
                  ) : (
                    user?.name
                  )}
                </h1>
                <p className="mt-2 text-blue-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {address}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Info */}
              <div className="col-span-1 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Role</label>
                      <div className="mt-1 text-sm text-gray-900 capitalize">{user?.role?.toLowerCase()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Member Since</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {new Date(user?.createdAt || '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {user?.role === 'PROVIDER' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user?.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          <Tag className="w-4 h-4 mr-1" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tasks and Reviews */}
              <div className="col-span-1 md:col-span-2 space-y-6">
                {/* Tasks Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Tasks</h3>
                  <div className="space-y-4">
                    {userTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} bg-opacity-10`}>
                              {getStatusIcon(task.status)}
                              <span className="ml-2">{task.status}</span>
                            </span>
                            {task.status === 'COMPLETED' &&
                              !submittedReviews.has(task._id) &&
                              user?.role === 'CLIENT' && (
                                <button
                                  onClick={() => handleReviewClick(task)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                  <Star className="w-4 h-4 mr-1" />
                                  Review
                                </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Reviews</h3>
                  <div className="space-y-4">
                    <ReviewList reviews={reviews} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewForm && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ReviewForm
                task={selectedTask}
                onClose={() => setShowReviewForm(false)}
                onSubmitted={handleReviewSubmitted}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Star, MapPin, Clock, Calendar, Edit2, X, Check, Tag } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import api from '../../lib/axios'

interface UserData {
  _id: string
  name: string
  email: string
  role: 'CLIENT' | 'PROVIDER'
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
}

export function UserProfile() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [userTasks, setUserTasks] = useState<Task[]>([])
  
  const { register, handleSubmit, reset } = useForm<UserData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'CLIENT',
      skills: user?.skills || [],
      location: {
        type: 'Point',
        coordinates: user?.location?.coordinates || [0, 0]
      },
      createdAt: user?.createdAt || '',
      updatedAt: user?.updatedAt || ''
    }
  })

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (user?.role === 'CLIENT') {
        try {
          const response = await api.get('/tasks/user-tasks')
          setUserTasks(response.data)
        } catch (error) {
          console.error('Failed to fetch user tasks:', error)
          toast.error('Failed to fetch booked services')
        }
      }
    }

    fetchUserTasks()
  }, [user?.role])

  const onSubmit = async (data: UserData) => {
    try {
      const updatedUser = await api.patch(`/users/${user?._id}`, {
        ...data,
        location: {
          type: 'Point',
          coordinates: data.location.coordinates
        }
      })
      
      updateUser(updatedUser.data)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
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
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">4.9 (20 reviews)</span>
              </div>
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
                  Location (latitude, longitude)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    {...register('location.coordinates.0')}
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    {...register('location.coordinates.1')}
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                    <p className="text-gray-600">
                      <span className="font-medium">User ID:</span> {user?._id}
                    </p>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      <span>
                        Lat: {user?.location?.coordinates[0]}, 
                        Lng: {user?.location?.coordinates[1]}
                      </span>
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

              {user?.role === 'CLIENT' && (
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status, task.rejectedByProvider)}`}>
                              {task.status === 'CANCELLED' && task.rejectedByProvider ? 'Rejected' : task.status}
                            </span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


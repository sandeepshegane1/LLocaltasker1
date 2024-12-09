import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

export function UserProfile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      location: user?.location?.coordinates 
        ? user.location.coordinates.join(', ') 
        : ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const [lat, lng] = data.location.split(',').map((coord: string) => Number(coord.trim()));
      const updatedUser = await api.patch(`/users/${user?._id}`, {
        ...data,
        location: {
          type: 'Point',
          coordinates: [lat, lng]
        }
      });
      
      updateUser(updatedUser.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-emerald-600">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-600">
                4.9 (20 reviews)
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location (latitude, longitude)
            </label>
            <input
              {...register('location')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setIsEditing(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="mt-4 space-y-4">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>2.5 miles away</span>
                </div>
              </div>
            </div>
            
            {user?.role === 'PROVIDER' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Availability</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Available Mon-Fri, 9AM-5PM</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>2 hour minimum booking</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {user?.role === 'PROVIDER' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>
              <div className="flex flex-wrap gap-2">
                {user?.services?.map((service: string) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                  >
                    {service.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
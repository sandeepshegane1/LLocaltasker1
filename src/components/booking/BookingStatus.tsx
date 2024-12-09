import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../../lib/axios';

// Comprehensive Booking interface
interface Booking {
  _id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  client: {
    name: string;
  };
  service: string;
  date: string;
  time: string;
}

// Define possible booking statuses
type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// Define query key type
type BookingQueryKey = ['bookings'];

export function BookingStatus({ booking }: { booking: Booking }) {
  // Use typed query client
  const queryClient = useQueryClient();

  // Typed mutation with specific status type
  const updateBooking = useMutation({
    mutationFn: async ({ status }: { status: BookingStatus }) => {
      const response = await api.patch<Booking>(`/bookings/${booking._id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      // Use typed query key
      queryClient.invalidateQueries({ queryKey: ['bookings'] as BookingQueryKey });
      toast.success('Booking status updated');
    },
    onError: () => {
      toast.error('Failed to update booking status');
    }
  });

  // Status color mapping with type safety
  const getStatusColor = (status: BookingStatus) => {
    const statusColors: Record<BookingStatus, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };

    return statusColors[status];
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Booking Details</h3>
        <span 
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-gray-600">Client:</span>
          <span className="ml-2 font-medium">{booking.client.name}</span>
        </div>
        <div>
          <span className="text-gray-600">Service:</span>
          <span className="ml-2 font-medium">{booking.service}</span>
        </div>
        <div>
          <span className="text-gray-600">Date:</span>
          <span className="ml-2 font-medium">
            {new Date(booking.date).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Time:</span>
          <span className="ml-2 font-medium">{booking.time}</span>
        </div>
      </div>

      {booking.status === 'PENDING' && (
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => updateBooking.mutate({ status: 'ACCEPTED' })}
            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
          >
            Accept
          </button>
          <button
            onClick={() => updateBooking.mutate({ status: 'REJECTED' })}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
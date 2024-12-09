import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookingCardProps {
  provider: any;
  onBook: () => void;
}

export function BookingCard({ provider, onBook }: BookingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-emerald-600">
              {provider.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{provider.name}</h3>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">
                {provider.rating} ({provider.reviewCount} reviews)
              </span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <span className="text-2xl font-bold text-gray-900">
              ${provider.hourlyRate}/hr
            </span>
            <p className="text-sm text-emerald-600">2 HOUR MINIMUM</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{provider.distance} miles away</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Available Mon-Fri, 9AM-5PM</span>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-2">About</h4>
          <p className="text-gray-600">{provider.description}</p>
          <Link
            to={`/profile/${provider._id}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium mt-2 inline-block"
          >
            View Profile & Reviews
          </Link>
        </div>

        <button
          onClick={onBook}
          className="mt-6 w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
        >
          Select & Continue
        </button>
      </div>
    </div>
  );
}
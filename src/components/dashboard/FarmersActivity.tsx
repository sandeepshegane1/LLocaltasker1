'use client'

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Star, MapPin, Calendar, Info, Crosshair, TreesIcon as Plant } from 'lucide-react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import { calculateDistance } from '../../utils/distance';
import { FARMERS_SERVICES, FarmersServices } from '../../constants/farmers';

// Interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'PROVIDER' | 'BUYER';
}

interface Farmer extends User {
  farmType?: string;
  crops?: string[];
  rating?: number;
  completedSales?: number;
  location?: {
    type: string;
    coordinates: number[];
  };
}

interface Order {
  _id?: string;
  cropName: string;
  quantity: number;
  price: number;
  category: string;
  buyer: string;
  farmer: string;
  location: {
    type: string;
    coordinates: number[];
  };
  harvestDate?: Date;
  quality?: 'STANDARD' | 'PREMIUM' | 'ORGANIC';
}

interface OrderFormData {
  cropName: string;
  quantity: number;
  price: number;
  harvestDate: string;
  quality: 'STANDARD' | 'PREMIUM' | 'ORGANIC';
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

// Utility Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid"></div>
  </div>
);

const FarmerAvatar = ({ name }: { name: string }) => (
  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-md">
    <span className="text-green-600 font-bold text-lg uppercase">
      {name.charAt(0)}
    </span>
  </div>
);

// Reusable Form Input Component
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
      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

export function FarmersActivity() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orderFormData, setOrderFormData] = useState<OrderFormData>({
    cropName: '',
    quantity: 0,
    price: 0,
    harvestDate: '',
    quality: 'STANDARD',
    location: {
      latitude: null,
      longitude: null
    }
  });
  const [formErrors, setFormErrors] = useState<Partial<OrderFormData>>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [buyerLocation, setBuyerLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Authentication and data fetching logic
  const { user: buyerUser, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));

  const { data: farmers, isLoading: isFarmersLoading, error } = useQuery<Farmer[]>({
    queryKey: ['farmers', selectedCategory],
    queryFn: async () => {
      const response = await api.get(`/users/farmers${selectedCategory ? `?category=${selectedCategory}` : ''}`);
      return response.data;
    },
    enabled: isAuthenticated && !!buyerUser?._id
  });

  const createOrderMutation = useMutation<Order, Error, Order>({
    mutationFn: async (orderData) => {
      const response = await api.post('/orders', orderData);
      return response.data;
    },
    onSuccess: (data) => {
      alert(`Order created successfully with ID: ${data._id}`);
      resetForm();
    },
    onError: (error) => {
      console.error(error);
      alert('Failed to create order');
    },
  });

  // Geolocation function
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrderFormData(prev => ({
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
          setBuyerLocation({
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

  // Validation method
  const validateForm = (): boolean => {
    const errors: Partial<OrderFormData> = {};

    if (!orderFormData.cropName.trim()) errors.cropName = 'Crop name is required';
    if (orderFormData.quantity <= 0) errors.quantity = 'Quantity must be greater than zero';
    if (orderFormData.price <= 0) errors.price = 'Price must be greater than zero';
    if (!orderFormData.harvestDate) errors.harvestDate = 'Harvest date is required';
    if (orderFormData.location.latitude === null || orderFormData.location.longitude === null) {
      errors.location = 'Location is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Order submission handler
  const handleSubmitOrder = (farmer: Farmer) => {
    if (validateForm()) {
      const orderData: Order = {
        cropName: orderFormData.cropName,
        quantity: orderFormData.quantity,
        price: orderFormData.price,
        category: selectedCategory || '',
        buyer: buyerUser?._id || '',
        farmer: farmer._id,
        location: {
          type: 'Point',
          coordinates: [
            orderFormData.location.longitude!, 
            orderFormData.location.latitude!
          ]
        },
        harvestDate: new Date(orderFormData.harvestDate),
        quality: orderFormData.quality
      };

      createOrderMutation.mutate(orderData);
    }
  };

  // Form reset method
  const resetForm = () => {
    setOrderFormData({
      cropName: '',
      quantity: 0,
      price: 0,
      harvestDate: '',
      quality: 'STANDARD',
      location: {
        latitude: null,
        longitude: null
      }
    });
    setFormErrors({});
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setOrderFormData(prev => {
      if (name === 'quantity' || name === 'price') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  // Render methods
  if (isFarmersLoading) return <LoadingSpinner />;

  if (error) return (
    <div className="text-center p-6 bg-red-50">
      <Info className="mx-auto mb-4 text-red-500" size={48} />
      <p className="text-red-600">Error loading farmers. Please try again later.</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-green-800">Farmers Activity</h2>
      
      {/* Category Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Select a category:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FARMERS_SERVICES.map((service: FarmersServices) => (
            <button
              key={service.category}
              onClick={() => setSelectedCategory(service.category)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
                selectedCategory === service.category
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              <service.icon className="w-8 h-8 mb-2" />
              <span className="text-sm text-center">{service.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Farmers List */}
      {selectedCategory && farmers && farmers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {farmers.map((farmer) => (
            <div 
              key={farmer._id}
              className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row p-6">
                {/* Left Column: Farmer Info */}
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                  <div className="flex items-center mb-4">
                    <FarmerAvatar name={farmer.name} />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-green-900">{farmer.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>
                          {farmer.rating?.toFixed(1) || '4.8'} 
                          <span className="ml-1">
                            ({farmer.completedSales || 24} sales)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Farmer Details */}
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-green-500" />
                      <span>
                        {farmer.location?.coordinates && buyerLocation
                          ? `${calculateDistance(
                              buyerLocation.latitude,
                              buyerLocation.longitude,
                              farmer.location.coordinates[1],
                              farmer.location.coordinates[0]
                            )} km away`
                          : 'Distance not available'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Plant className="w-5 h-5 mr-3 text-green-500" />
                      <span>{farmer.farmType || 'Mixed Farming'}</span>
                    </div>
                  </div>

                  {/* Crops */}
                  <div className="mt-4">
                    <h4 className="font-medium mb-3 text-green-800">Crops</h4>
                    <div className="flex flex-wrap gap-2">
                      {farmer.crops?.map((crop) => (
                        <span
                          key={crop}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                        >
                          {crop.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Order Creation Form */}
                <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 md:pl-6 pt-6 md:pt-0">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitOrder(farmer);
                    }} 
                    className="space-y-4"
                  >
                    {/* Crop Name */}
                    <FormInput 
                      label="Crop Name"
                      type="text"
                      name="cropName"
                      value={orderFormData.cropName}
                      onChange={handleInputChange}
                      placeholder="Enter crop name"
                      error={formErrors.cropName}
                    />

                    {/* Quantity and Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput 
                        label="Quantity (kg)"
                        type="number"
                        name="quantity"
                        value={orderFormData.quantity}
                        onChange={handleInputChange}
                        placeholder="0"
                        error={formErrors.quantity}
                      />
                      
                      <FormInput 
                        label="Price per kg"
                        type="number"
                        name="price"
                        value={orderFormData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        error={formErrors.price}
                      />
                    </div>

                    {/* Harvest Date */}
                    <FormInput 
                      label="Harvest Date"
                      type="date"
                      name="harvestDate"
                      value={orderFormData.harvestDate}
                      onChange={handleInputChange}
                      error={formErrors.harvestDate}
                    />

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Location</label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Crosshair className="w-5 h-5 mr-2" />
                          {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                        </button>
                        {orderFormData.location.latitude !== null && orderFormData.location.longitude !== null && (
                          <span className="text-sm text-gray-600">
                            Location set: {orderFormData.location.latitude.toFixed(4)}, {orderFormData.location.longitude.toFixed(4)}
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

                    {/* Quality Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                      <select
                        name="quality"
                        value={orderFormData.quality}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option value="STANDARD">Standard</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="ORGANIC">Organic</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={createOrderMutation.isPending}
                      className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createOrderMutation.isPending ? 'Creating Order...' : 'Create Order'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50">
          <Info className="mx-auto mb-4 text-gray-500" size={48} />
          <p className="text-gray-600">
            {selectedCategory 
              ? "No farmers found in this category." 
              : "Please select a category to view farmers."}
          </p>
        </div>
      )}
    </div>
  );
}

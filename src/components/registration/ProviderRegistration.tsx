import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { SERVICES } from '../../constants/services';
import { WORKER_CATEGORIES } from '../../constants/workers';
import { MapPin, Loader } from 'lucide-react';

export function ProviderRegistration() {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      providerType: ''
    }
  });
  
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const providerType = watch('providerType');
  const name = watch('name');
  const email = watch('email');
  const password = watch('password');

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(newLocation);
          setIsGettingLocation(false);
          console.log('Location set:', newLocation);
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

  const onSubmit = async (data: any) => {
    if (step === 1) {
      if (!name || !email || !password || !providerType) {
        toast.error('Please fill all required fields');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (selectedServices.length === 0) {
        toast.error('Please select at least one service/category');
        return;
      }
      setStep(3);
      return;
    }

    if (!location) {
      toast.error('Please provide your location');
      return;
    }

    try {
      const userData = {
        name,
        email,
        password,
        role: 'PROVIDER',
        providerType,
        services: selectedServices,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      };

      console.log('Sending user data:', userData);
      await registerUser(userData);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'An error occurred during registration');
    }
  };

  const renderFirstStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          {...register('name', { 
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' }
          })}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: 'Invalid email address'
            }
          })}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })}
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Provider Type</label>
        <select
          {...register('providerType', { required: 'Provider type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500"
        >
          <option value="">Select type</option>
          <option value="SERVICE">Service Provider</option>
          <option value="WORKER">Worker</option>
        </select>
        {errors.providerType && <p className="text-red-500 text-xs">{errors.providerType.message as string}</p>}
      </div>
    </div>
  );

  const renderServiceSelection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        Select your {providerType === 'SERVICE' ? 'services' : 'work categories'}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {(providerType === 'SERVICE' ? SERVICES : WORKER_CATEGORIES).map((item) => (
          <div
            key={item.category}
            onClick={() => handleServiceToggle(item.category)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedServices.includes(item.category)
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-200'
            }`}
          >
            <item.icon className="w-6 h-6 mb-2 text-emerald-600" />
            <h3 className="font-medium">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLocationStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Provide Your Location</h2>
      <div className="flex items-center justify-center space-x-4">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {isGettingLocation ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Getting Location...
            </>
          ) : (
            <>
              <MapPin className="-ml-1 mr-2 h-5 w-5" />
              Get Current Location
            </>
          )}
        </button>
      </div>
      {location && (
        <div className="text-center text-sm text-gray-600">
          Location set: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </div>
      )}
      {locationError && (
        <p className="text-center text-red-500 text-sm">{locationError}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && renderFirstStep()}
        {step === 2 && renderServiceSelection()}
        {step === 3 && renderLocationStep()}
        
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
        >
          {step === 1 ? 'Next' : step === 2 ? 'Next' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, DollarSign, MapPin, CheckCircle, Trash2, User, PenToolIcon as Tool, Tractor } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

interface Farmer {
  _id: string;
  professionalProfile: {
    name: {
      firstName: string;
      lastName: string;
    };
    contactDetails: {
      phone: {
        primary: string;
      };
      email: string;
    };
  };
  serviceExpertise: {
    primarySpecialization: string;
    supportedCropTypes: string[];
  };
  services: Array<{
    _id: string;
    serviceName: string;
    description: string;
    status: 'AVAILABLE' | 'BOOKED' | 'COMPLETED';
    price: number;
    serviceArea: {
      districts: string[];
      states: string[];
    };
    availability: {
      daysAvailable: string[];
      seasonalAvailability: {
        startMonth: string;
        endMonth: string;
      };
    };
  }>;
  resources: {
    machineryOwned: Array<{
      type: string;
      model: string;
      manufacturingYear: number;
      condition: string;
    }>;
    additionalEquipment: string[];
  };
  businessCredentials: {
    registrationType: string;
    businessRegistrationNumber: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export function FarmerDashboard() {
  const farmer = useAuthStore((state) => state.user) as Farmer | null;
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'resources'>('profile');
  const [activeServiceTab, setActiveServiceTab] = useState<'available' | 'booked' | 'completed'>('available');
  const queryClient = useQueryClient();

  console.log('Initial farmer state:', farmer);

  const { data: farmerData, isLoading, error } = useQuery({
    queryKey: ['farmer-data', farmer?._id],
    queryFn: async () => {
      console.log('Fetching farmer data for ID:', farmer?._id);
      if (!farmer?._id) throw new Error('Farmer ID not found');
      try {
        const response = await api.get(`/farmers/${farmer._id}`);
        console.log('API response:', response);
        return response.data as Farmer;
      } catch (error) {
        console.error('API call error:', error);
        throw error;
      }
    },
    enabled: !!farmer?._id,
    onError: (error) => {
      console.error('Error in useQuery:', error);
      toast.error('Failed to load farmer data');
    }
  });

  useEffect(() => {
    console.log('Farmer data updated:', farmerData);
  }, [farmerData]);

  useEffect(() => {
    if (error) {
      console.error('Error in farmer data query:', error);
    }
  }, [error]);

  const updateServiceStatus = async (serviceId: string, newStatus: 'AVAILABLE' | 'BOOKED' | 'COMPLETED') => {
    try {
      console.log(`Updating service ${serviceId} to status ${newStatus}`);
      await api.patch(`/farmers/${farmer?._id}/services/${serviceId}`, { status: newStatus });
      queryClient.invalidateQueries(['farmer-data']);
      toast.success(`Service status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update service status:', error);
      toast.error('Failed to update service status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (error || !farmerData) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Rendering error state. Error:', errorMessage);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">Unable to load farmer data. Please try again later.</p>
          <p className="text-sm text-gray-500 mb-4">Error details: {errorMessage}</p>
          <button
            onClick={() => {
              console.log('Retrying query...');
              queryClient.invalidateQueries(['farmer-data']);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering dashboard with data:', farmerData);

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Farmer Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Name:</p>
          <p>{`${farmerData.professionalProfile.name.firstName} ${farmerData.professionalProfile.name.lastName}`}</p>
        </div>
        <div>
          <p className="font-semibold">Phone:</p>
          <p>{farmerData.professionalProfile.contactDetails.phone.primary}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{farmerData.professionalProfile.contactDetails.email}</p>
        </div>
        <div>
          <p className="font-semibold">Primary Specialization:</p>
          <p>{farmerData.serviceExpertise.primarySpecialization}</p>
        </div>
        <div>
          <p className="font-semibold">Supported Crop Types:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {farmerData.serviceExpertise.supportedCropTypes.map((crop, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {crop}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold">Business Registration:</p>
          <p>{farmerData.businessCredentials.registrationType} - {farmerData.businessCredentials.businessRegistrationNumber}</p>
        </div>
      </div>
    </div>
  );

  const renderServices = () => {
    console.log('Services data:', farmerData.services);
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Services</h2>
        <div className="flex mb-4 space-x-2">
          <button
            onClick={() => setActiveServiceTab('available')}
            className={`px-4 py-2 rounded-md ${
              activeServiceTab === 'available' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setActiveServiceTab('booked')}
            className={`px-4 py-2 rounded-md ${
              activeServiceTab === 'booked' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Booked
          </button>
          <button
            onClick={() => setActiveServiceTab('completed')}
            className={`px-4 py-2 rounded-md ${
              activeServiceTab === 'completed' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmerData.services && farmerData.services.length > 0 ? (
            farmerData.services
              .filter(service => service.status && service.status.toLowerCase() === activeServiceTab)
              .map(service => (
                <div key={service._id} className="border rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">{service.serviceName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-sm">${service.price}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-sm">{service.serviceArea.states.join(', ')}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-sm">{service.availability.daysAvailable.join(', ')}</span>
                  </div>
                  <div className="mt-4">
                    {activeServiceTab === 'available' && (
                      <button
                        onClick={() => updateServiceStatus(service._id, 'BOOKED')}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Mark as Booked
                      </button>
                    )}
                    {activeServiceTab === 'booked' && (
                      <button
                        onClick={() => updateServiceStatus(service._id, 'COMPLETED')}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <p>No services available.</p>
          )}
        </div>
      </div>
    );
  };

  const renderResources = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Resources</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Machinery Owned</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmerData.resources.machineryOwned.map((machine, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <Tractor className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-semibold">{machine.type}</span>
              </div>
              <p className="text-sm text-gray-600">Model: {machine.model}</p>
              <p className="text-sm text-gray-600">Year: {machine.manufacturingYear}</p>
              <p className="text-sm text-gray-600">Condition: {machine.condition}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Additional Equipment</h3>
        <div className="flex flex-wrap gap-2">
          {farmerData.resources.additionalEquipment.map((equipment, index) => (
            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {equipment}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Farmer Dashboard</h1>
      <div className="mb-6 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'profile' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'services' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-md ${
              activeServiceTab === 'resources' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Resources
          </button>
        </div>
      </div>
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'services' && renderServices()}
      {activeTab === 'resources' && renderResources()}
    </div>
  );
}


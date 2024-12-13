import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { MapPin, Loader } from 'lucide-react';
import { Farmers } from '../../store/authStore';

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: "FARMER" | "SERVICE_PROVIDER";
  primarySpecialization: string;
  supportedCropTypes: string[];
  serviceName: string;
  serviceDescription: string;
  statesServed: string;
  districtsServed: string;
  daysAvailable: string[];
  seasonalStartMonth: string;
  seasonalEndMonth: string;
  machineryOwned: {
    type: string;
    model: string;
    manufacturingYear: number;
    condition: string;
  }[];
  additionalEquipment: string;
  registrationType: string;
  businessRegistrationNumber: string;
};

const specializations = [
  "Agricultural Machinery",
  "Irrigation Services",
  "Crop Protection",
  "Soil Management",
  "Seed Supply",
  "Fertilizer Distribution",
  "Pest Control",
  "Agricultural Consulting",
  "Harvesting Services",
  "Transportation",
  "Cold Storage Management"
];

const cropTypes = [
  "Rice", "Wheat", "Maize", 
  "Cotton", "Sugarcane", "Pulses", 
  "Vegetables", "Fruits", "Spices"
];

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const machineryTypes = [
  "Tractor", "Harvester", "Sprayer", "Plougher", "Thresher", "Seed Drill", "Irrigation Pump"
];

const registrationTypes = ["Individual", "Partnership", "Private Limited", "Cooperative"];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal"
];

export default function FarmerRegistration() {
  const { farmerregister:farmerregisterUser } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setFormData({ ...formData, ...data });
    if (step < 5) {
      setStep(step + 1);
    } else {
      if (!location) {
        toast.error('Please provide your location');
        return;
      }

      try {
        const userData: Partial<Farmers> & { password: string } = {
          password: data.password,
          role: data.role,
          professionalProfile: {
            name: {
              firstName: data.firstName,
              lastName: data.lastName
            },
            contactDetails: {
              phone: {
                primary: data.phone
              },
              email: data.email
            }
          },
          serviceExpertise: {
            primarySpecialization: data.primarySpecialization,
            supportedCropTypes: data.supportedCropTypes || []
          },
          services: [{
            serviceName: data.serviceName,
            description: data.serviceDescription,
            serviceArea: {
              districts: [data.districtsServed],
              states: [data.statesServed]
            },
            availability: {
              daysAvailable: data.daysAvailable,
              seasonalAvailability: {
                startMonth: data.seasonalStartMonth,
                endMonth: data.seasonalEndMonth
              }
            }
          }],
          resources: {
            machineryOwned: data.machineryOwned,
            additionalEquipment: data.additionalEquipment ? data.additionalEquipment.split(',').map(e => e.trim()) : []
          },
          businessCredentials: {
            registrationType: data.registrationType,
            businessRegistrationNumber: data.businessRegistrationNumber
          },
          location: {
            type: 'Point',
            coordinates: [location!.longitude, location!.latitude]
          }
        };

        console.log('Sending user data:', userData);
        await farmerregisterUser(userData);
        toast.success('Registration successful!');
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Registration error:', error);
        toast.error(error.response?.data?.error || 'An error occurred during registration');
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Professional Identity</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                {...register("firstName", { required: "First name is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                {...register("lastName")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                {...register("phone", { 
                  required: "Phone number is required",
                  pattern: {
                    value: /^(\+91)?[6-9]\d{9}$/,
                    message: "Invalid Indian mobile number"
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters long" }
                })}
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                {...register("role", { required: "Role selection is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select role</option>
                <option value="FARMER">Farmer</option>
                {/* <option value="SERVICE_PROVIDER">Service Provider</option> */}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Service Expertise</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Specialization</label>
              <select
                {...register("primarySpecialization", { required: "Primary specialization is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {errors.primarySpecialization && <p className="text-red-500 text-xs mt-1">{errors.primarySpecialization.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Supported Crop Types</label>
              <div className="mt-2 space-y-2">
                {cropTypes.map((crop) => (
                  <div key={crop} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("supportedCropTypes")}
                      value={crop}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      {crop}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Service Offerings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Name</label>
              <input
                {...register("serviceName", { required: "Service name is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.serviceName && <p className="text-red-500 text-xs mt-1">{errors.serviceName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Description</label>
              <textarea
                {...register("serviceDescription", { required: "Service description is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
              />
              {errors.serviceDescription && <p className="text-red-500 text-xs mt-1">{errors.serviceDescription.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State Served</label>
              <select
                {...register("statesServed", { required: "State must be selected" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.statesServed && <p className="text-red-500 text-xs mt-1">{errors.statesServed.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">District Served</label>
              <input
                {...register("districtsServed", { required: "District is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter district"
              />
              {errors.districtsServed && <p className="text-red-500 text-xs mt-1">{errors.districtsServed.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Days Available</label>
              <div className="mt-2 space-y-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("daysAvailable")}
                      value={day}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Seasonal Availability</label>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-xs text-gray-700">Start Month</label>
                  <select
                    {...register("seasonalStartMonth")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Select month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700">End Month</label>
                  <select
                    {...register("seasonalEndMonth")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Select month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Equipment and Resources</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Machinery Owned</label>
              <div className="mt-2 space-y-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex space-x-2">
                    <select
                      {...register(`machineryOwned.${index}.type` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="">Select type</option>
                      {machineryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      {...register(`machineryOwned.${index}.model` as const)}
                      placeholder="Model"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <input
                      type="number"
                      {...register(`machineryOwned.${index}.manufacturingYear` as const)}
                      placeholder="Year"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <select
                      {...register(`machineryOwned.${index}.condition` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="">Select condition</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Needs Repair">Needs Repair</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Equipment</label>
              <input
                {...register("additionalEquipment")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Comma-separated list of additional equipment"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Business Credentials</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Type</label>
              <select
                {...register("registrationType", { required: "Registration type is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select registration type</option>
                {registrationTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.registrationType && <p className="text-red-500 text-xs mt-1">{errors.registrationType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Registration Number</label>
              <input
                {...register("businessRegistrationNumber")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                <div className="text-center text-sm text-gray-600 mt-2">
                  Location set: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </div>
              )}
              {locationError && (
                <p className="text-center text-red-500 text-sm mt-2">{locationError}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Farmer Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {renderStep()}
        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {step < 5 ? 'Next' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

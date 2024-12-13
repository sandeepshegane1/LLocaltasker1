import React, { useState } from 'react';
import { ClientRegistration } from '../components/registration/ClientRegistration';
import { ProviderRegistration } from '../components/registration/ProviderRegistration';
import FarmerRegistration from '../components/registration/FarmerRegistration';

export function Register() {
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'PROVIDER' | 'FARMER' | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        {!selectedRole ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedRole('CLIENT')}
              className="w-full flex justify-center py-3 px-4 border-2 border-emerald-600 rounded-md shadow-sm text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Register as Client
            </button>
            <button
              onClick={() => setSelectedRole('PROVIDER')}
              className="w-full flex justify-center py-3 px-4 border-2 border-emerald-600 rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Register as Service Provider
            </button>
            <button
              onClick={() => setSelectedRole('FARMER')}
              className="w-full flex justify-center py-3 px-4 border-2 border-emerald-600 rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Register as Farmer
            </button>
          </div>
        ) : (
          <>
            {selectedRole === 'CLIENT' ? (
              <ClientRegistration />
            ) : selectedRole === 'PROVIDER' ? (
              <ProviderRegistration />
            ) : (
              <FarmerRegistration />
            )}
            <button
              onClick={() => setSelectedRole(null)}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Back to Role Selection
            </button>
          </>
        )}
      </div>
    </div>
  );
}


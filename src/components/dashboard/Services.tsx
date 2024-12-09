import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../../constants/services';

export function Services() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Available Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((service) => (
          <div
            key={service.category}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/dashboard/services/${service.category}/providers`)}
          >
            <div className="relative h-48">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <service.icon className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button className="text-emerald-600 font-medium hover:text-emerald-700">
                Find Providers →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  {
    category: 'PLUMBING',
    title: 'Plumbing Services',
    description: 'Professional plumbing solutions for your home',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500'
  },
  {
    category: 'ELECTRICAL',
    title: 'Electrical Services',
    description: 'Expert electrical repairs and installations',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=500'
  },
  {
    category: 'CLEANING',
    title: 'Cleaning Services',
    description: 'Professional cleaning for your space',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500'
  },
  {
    category: 'LANDSCAPING',
    title: 'Landscaping',
    description: 'Transform your outdoor space',
    image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=500'
  }
];

export function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Available Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <div
            key={service.category}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/dashboard/services/${service.category}/providers`)}
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <button className="mt-4 text-emerald-600 font-medium hover:text-emerald-700">
                Find Providers →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Services } from '../components/dashboard/Services';
import { Workers } from '../components/dashboard/Workers';
import { ServiceProviders } from '../components/dashboard/ServiceProviders';
import { WorkersByCategory } from '../components/dashboard/WorkersByCategory';
import { ProviderDashboard } from '../components/dashboard/ProviderDashboard';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { Farmers } from '../components/dashboard/Farmers';
import { FarmersActivity} from '../components/dashboard/FarmersActivity'
export function Dashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.name}!
          </h1>
        </div>
        
        {user.role === 'CLIENT' ? (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/services" replace />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:category/providers" element={<ServiceProviders />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/workers/:category" element={<WorkersByCategory />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/farmers/:category" element={<FarmersActivity />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/*" element={<ProviderDashboard />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
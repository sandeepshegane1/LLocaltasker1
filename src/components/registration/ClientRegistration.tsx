// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { useAuthStore } from '../../store/authStore';

// export function ClientRegistration() {
//   const { register, handleSubmit } = useForm();
//   const registerUser = useAuthStore((state) => state.register);
//   const navigate = useNavigate();

//   const onSubmit = async (data: any) => {
//     try {
//       const userData = {
//         ...data,
//         role: 'CLIENT',
//         location: {
//           type: 'Point',
//           coordinates: [0, 0]
//         }
//       };

//       await registerUser(userData);
//       toast.success('Registration successful!');
//       navigate('/dashboard');
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Registration failed');
//     }
//   };

//   return (
//     <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Full Name</label>
//         <input
//           {...register('name')}
//           type="text"
//           required
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Email</label>
//         <input
//           {...register('email')}
//           type="email"
//           required
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Password</label>
//         <input
//           {...register('password')}
//           type="password"
//           required
//           minLength={6}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
//         />
//       </div>

//       <button
//         type="submit"
//         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
//       >
//         Register as Client
//       </button>
//     </form>
//   );
// }

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export function ClientRegistration() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const registerUser = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const userData = {
        ...data,
        role: 'CLIENT',
        location: {
          type: 'Point',
          coordinates: [0, 0]
        }
      };

      await registerUser(userData);
      toast.success('Registration successful!', {
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed', {
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#EF4444',
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register as a Client
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our community and start your journey
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                {...register('name', { required: 'Full name is required' })}
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address',
                  }
                })}
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  }
                })}
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {(errors.name || errors.email || errors.password) && (
            <div className="text-red-500 text-sm mt-2">
              {errors.name?.message || errors.email?.message || errors.password?.message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {isSubmitting ? 'Registering...' : 'Register as Client'}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}


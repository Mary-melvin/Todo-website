'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the AuthProvider's register function to handle authentication
      await register(name, email, password);
      // The register function handles the redirect to dashboard
    } catch (err) {
      setError('Sign up failed. Please try again.');
      console.error('Sign up error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-blue-100 to-sky-blue-300">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div>
            <div className="mx-auto h-16 w-16 rounded-full bg-sky-blue-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Todo App</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 sm:text-sm transition duration-200"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 sm:text-sm transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 sm:text-sm transition duration-200"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-sky-blue-500 to-sky-blue-600 hover:from-sky-blue-600 hover:to-sky-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-blue-500 disabled:opacity-50 transition duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Creating account...
                  </span>
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="font-medium text-sky-blue-600 hover:text-sky-blue-800 transition duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
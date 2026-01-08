'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-sky-100">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-800 mb-6">
            Manage Your Daily Todo Tasks Efficiently
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            A simple and intuitive todo application to help you organize your tasks and boost productivity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/sign-in"
              className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sky-800 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to organize your tasks and stay productive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-sky-50 p-8 rounded-xl">
              <div className="text-sky-600 text-3xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Task Management</h3>
              <p className="text-gray-600">
                Create, update, and manage your tasks with ease using our intuitive interface.
              </p>
            </div>

            <div className="bg-sky-50 p-8 rounded-xl">
              <div className="text-sky-600 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track your progress and productivity with detailed analytics and insights.
              </p>
            </div>

            <div className="bg-sky-50 p-8 rounded-xl">
              <div className="text-sky-600 text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is protected with industry-standard security measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Todo App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
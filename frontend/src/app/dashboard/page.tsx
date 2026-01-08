'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { PlusCircleIcon, Bars3BottomLeftIcon, ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0: welcome, 1: create task, 2: view tasks, 3: analytics

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to main page if not authenticated
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100">
        <div className="text-lg text-sky-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will handle it
  }

  // Navigation steps
  const steps = [
    { id: 1, title: 'Create New Task', description: 'Add a new task to your list', href: '/dashboard/create', icon: PlusCircleIcon },
    { id: 2, title: 'Your Tasks', description: 'View and manage your tasks', href: '/dashboard/list', icon: Bars3BottomLeftIcon },
    { id: 3, title: 'Analytics', description: 'Track your task progress', href: '/dashboard/analytics', icon: ChartBarIcon }
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-sky-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sky-800 mb-2">ToDo-Dashboard</h1>
          <p className="text-sky-600">Manage your tasks and track your progress</p>
        </div>

        {/* Step indicator - Progress tracker */}
        <div className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-sky-100">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-sky-800 mb-4">Getting Started</h2>
            <div className="flex justify-center items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(index + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      currentStep >= index + 1
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > index + 1 ? 'bg-sky-500' : 'bg-sky-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-12">
              {steps.map((step, index) => (
                <span
                  key={step.id}
                  className={`text-sm font-medium ${
                    currentStep >= index + 1 ? 'text-sky-700' : 'text-sky-500'
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Welcome step */}
          {currentStep === 0 && (
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-sky-800 mb-4">Welcome to Your Todo Task Manager!</h2>
              <p className="text-lg text-sky-600 mb-6">
                Let's get started by creating your first task. Follow the steps below to manage your tasks effectively.
              </p>
              <div className="bg-sky-50 rounded-xl p-8 border border-sky-200">
                <div className="h-20 w-20 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="h-10 w-10 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-sky-800 mb-3">Getting Started</h3>
                <p className="text-sky-600 mb-6">
                  Click the button below to start creating your first task. We'll guide you through the process step by step.
                </p>
                <button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white py-3 px-8 rounded-lg transition duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Start Creating Tasks
                </button>
              </div>
            </div>
          )}

          {/* Step-by-step content */}
          {currentStep > 0 && currentStep <= steps.length && (
            <div className="bg-sky-50 rounded-xl p-8 border border-sky-200">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
                  {React.createElement(steps[currentStep - 1].icon, { className: 'h-8 w-8 text-sky-600' })}
                </div>
                <h2 className="text-2xl font-bold text-sky-800 mb-2">{steps[currentStep - 1].title}</h2>
                <p className="text-sky-600">{steps[currentStep - 1].description}</p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`py-2 px-6 rounded-lg transition duration-200 font-medium ${
                    currentStep === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                {currentStep < steps.length ? (
                  <Link href={steps[currentStep - 1].href}>
                    <button className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg font-medium">
                      Go to {steps[currentStep - 1].title}
                    </button>
                  </Link>
                ) : (
                  <Link href={steps[currentStep - 1].href}>
                    <button className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg font-medium">
                      View Analytics
                    </button>
                  </Link>
                )}

                {currentStep < steps.length && (
                  <button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-sky-800 mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <Link
                key={step.id}
                href={step.href}
                className="bg-white rounded-xl shadow-sm p-6 border border-sky-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center group"
              >
                <div className="h-14 w-14 rounded-full bg-sky-100 flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors duration-300">
                  {React.createElement(step.icon, { className: 'h-7 w-7 text-sky-600' })}
                </div>
                <h3 className="text-lg font-semibold text-sky-800 mb-2">{step.title}</h3>
                <p className="text-sky-600 text-sm">{step.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-sky-100">
          <h3 className="text-lg font-semibold text-sky-800 mb-4">Full Stack ToDo App</h3>
          <p className="text-sky-600 mb-4">
            Explore the different sections of your dashboard to manage your tasks effectively.
            Each section provides tools to help you organize, track, and analyze your work.
          </p>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

interface AnalyticsData {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completion_rate: number;
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign in if not authenticated
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchAnalytics = async () => {
        try {
          setLoadingAnalytics(true);
          const data = await api.getTaskAnalytics();
          setAnalytics(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching analytics:', err);
          setError('Failed to load analytics. Please try again later.');
        } finally {
          setLoadingAnalytics(false);
        }
      };

      fetchAnalytics();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-blue-50 to-sky-blue-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will handle it
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-blue-50 to-sky-blue-100">
      <Navbar />

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/dashboard" className="text-gray-500 border-b-2 border-transparent hover:border-sky-blue-300 hover:text-sky-blue-700 px-1 pt-4 pb-2 text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/dashboard/create" className="text-gray-500 border-b-2 border-transparent hover:border-sky-blue-300 hover:text-sky-blue-700 px-1 pt-4 pb-2 text-sm font-medium">
              Create Task
            </Link>
            <Link href="/dashboard/list" className="text-gray-500 border-b-2 border-transparent hover:border-sky-blue-300 hover:text-sky-blue-700 px-1 pt-4 pb-2 text-sm font-medium">
              View Tasks
            </Link>
            <Link href="/dashboard/analytics" className="text-sky-blue-600 border-b-2 border-sky-blue-600 px-1 pt-4 pb-2 text-sm font-medium">
              Analytics
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-blue-100">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-sky-blue-100 flex items-center justify-center mx-auto mb-6">
              <ChartBarIcon className="h-8 w-8 text-sky-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-sky-blue-800 mb-4">Task Analytics</h2>
            <p className="text-gray-600 mb-8">Track your task progress and productivity metrics.</p>

            {loadingAnalytics ? (
              <div className="flex justify-center mt-8">
                <div className="text-lg">Loading analytics...</div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            ) : analytics ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-sky-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-sky-blue-600">{analytics.total_tasks}</div>
                    <div className="text-gray-600">Total Tasks</div>
                  </div>
                  <div className="bg-sky-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600">{analytics.completed_tasks}</div>
                    <div className="text-gray-600">Completed</div>
                  </div>
                  <div className="bg-sky-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600">{analytics.pending_tasks}</div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{ width: `${analytics.completion_rate}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600">Completion Rate: {analytics.completion_rate}%</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No analytics data available.</p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard/list" className="inline-block bg-gradient-to-r from-sky-blue-500 to-sky-blue-600 hover:from-sky-blue-600 hover:to-sky-blue-700 text-white py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            Back to Tasks
          </Link>
        </div>
      </main>
    </div>
  );
}
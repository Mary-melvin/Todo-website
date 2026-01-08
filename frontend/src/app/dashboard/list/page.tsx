'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TaskList from '@/components/TaskList';

export default function TaskListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign in if not authenticated
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

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
            <Link href="/dashboard/list" className="text-sky-blue-600 border-b-2 border-sky-blue-600 px-1 pt-4 pb-2 text-sm font-medium">
              View Tasks
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <TaskList />

        <div className="mt-8 text-center">
          <Link href="/dashboard/analytics" className="inline-block bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            View Analytics
          </Link>
        </div>
      </main>
    </div>
  );
}
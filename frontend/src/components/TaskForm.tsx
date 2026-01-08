'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, TaskCreateData } from '@/lib/api';
import { PlusCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface TaskFormProps {
  onTaskCreated?: (task: any) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    try {
      const taskData: TaskCreateData = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      const newTask = await api.createTask(taskData);
      setTitle('');
      setDescription('');
      setError('');

      if (onTaskCreated) {
        onTaskCreated(newTask);
      }

      // Redirect to task list after successful task creation
      router.push('/dashboard/list');
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border border-sky-blue-100">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-sky-blue-100 flex items-center justify-center mr-3">
          <PlusCircleIcon className="h-6 w-6 text-sky-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-sky-blue-800">Create New Task</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-sky-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 transition duration-200"
            placeholder="Enter your task title"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-sky-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 transition duration-200"
            placeholder="Enter task description"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-sky-blue-500 to-sky-blue-600 hover:from-sky-blue-600 hover:to-sky-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-blue-500 disabled:opacity-50 transition duration-200 hover:shadow-lg"
        >
          {loading ? (
            <span className="flex items-center">
              <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Creating...
            </span>
          ) : (
            'Create Task'
          )}
        </button>
      </form>
    </div>
  );
}
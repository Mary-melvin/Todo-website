'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { api, Task } from '@/lib/api';
import { Bars3BottomLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface TaskListProps {
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: number) => void;
}

export default function TaskList({ onTaskUpdate, onTaskDelete }: TaskListProps) {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sort, setSort] = useState<'created' | 'title'>('created');

  useEffect(() => {
    if (!loading && user) {
      loadTasks();
    }
  }, [user, loading, statusFilter, sort]);

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      const userTasks = await api.getTasks(statusFilter, sort);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const updatedTask = await api.toggleTaskCompletion(task.id, !task.completed);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      if (onTaskUpdate) onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      if (onTaskDelete) onTaskDelete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8">Please sign in to view your tasks</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-sky-blue-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-sky-blue-100 flex items-center justify-center mr-3">
            <Bars3BottomLeftIcon className="h-6 w-6 text-sky-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-sky-blue-800">Your Tasks</h2>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-sky-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 transition duration-200"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="border border-sky-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 transition duration-200"
          >
            <option value="created">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {loadingTasks ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <ArrowPathIcon className="animate-spin h-8 w-8 text-sky-blue-500" />
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-sky-blue-100 flex items-center justify-center mx-auto mb-4">
            <Bars3BottomLeftIcon className="h-8 w-8 text-sky-blue-600" />
          </div>
          <p className="text-gray-500 text-lg">No tasks yet. Create your first task!</p>
          <p className="text-gray-400 mt-2">Get started by creating a new task above</p>
        </div>
      ) : (
        <ul className="divide-y divide-sky-blue-100">
          {tasks.map((task) => (
            <li key={task.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-sky-blue-50 p-3 rounded-lg transition duration-200">
              <div className="flex items-start sm:items-center w-full sm:w-auto">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task)}
                  className="h-5 w-5 text-sky-blue-600 rounded mt-1 sm:mt-0 mr-3 cursor-pointer"
                />
                <div className="w-full sm:w-auto">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1 text-sm">{task.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  task.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-sky-blue-100 text-sky-blue-800'
                }`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
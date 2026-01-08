'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items for authenticated users
  const authNavItems = [
    { name: 'Add Task', href: '/dashboard/create' },
    { name: 'View Tasks', href: '/dashboard/list' },
    { name: 'Analytics', href: '/dashboard/analytics' },
  ];

  // Navigation items for unauthenticated users
  const unauthNavItems = [
    { name: 'Sign In', href: '/auth/sign-in' },
    { name: 'Sign Up', href: '/auth/sign-up' },
  ];

  // Determine which navigation items to show based on auth status
  const navItems = user ? authNavItems : unauthNavItems;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-sky-800">Todo Dashboard</h1>
            <p className="hidden sm:block ml-4 text-sky-600">Manage your tasks efficiently</p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-sky-600 font-medium transition"
              >
                {item.name}
              </Link>
            ))}

            {user && (
              <div className="flex items-center space-x-4 pl-8 border-l border-gray-300">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Welcome, {user.name || user.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg transition shadow-md"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-sky-600 font-medium py-2"
              >
                {item.name}
              </Link>
            ))}

            {user && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Welcome, {user.name || user.email}
                </p>
                <button
                  onClick={logout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
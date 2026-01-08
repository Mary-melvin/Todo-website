'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt-token');
    if (storedToken) {
      setToken(storedToken);
      // In a real app, we would verify the token and get user info
      // For now, we'll just set a mock user
      setUser({ id: '1', email: 'user@example.com', name: 'Test User' });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Call the backend auth endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const jwtToken = data.jwt;
      localStorage.setItem('jwt-token', jwtToken);
      setToken(jwtToken);

      // Store user info in localStorage or derive from token
      const userObj = { id: '1', email, name: 'Test User' }; // In a real app, parse from JWT
      setUser(userObj);

      // Redirect to dashboard after login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Call the backend auth endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      const jwtToken = data.jwt;
      localStorage.setItem('jwt-token', jwtToken);
      setToken(jwtToken);

      // Store user info in localStorage or derive from token
      const userObj = { id: '1', email, name };
      setUser(userObj);

      // Redirect to dashboard after registration
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt-token');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// API client that fetches and attaches JWT tokens for authenticated requests
import { authClient } from './auth-client';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskCreateData {
  title: string;
  description?: string;
}

interface TaskUpdateData {
  title?: string;
  description?: string;
  completed?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  // Set the JWT token for subsequent requests
  setToken(token: string) {
    this.token = token;
  }

  // Get a valid JWT token from the backend API
  private async getValidToken(): Promise<string | null> {
    // First try to use the manually set token
    if (this.token) {
      return this.token;
    }

    // Try to get token from localStorage (set by AuthProvider)
    let token = localStorage.getItem('jwt-token');
    if (token) {
      return token;
    }

    // If no token exists locally, we need to request one from the backend
    // This requires a valid Better Auth session, which we don't have in this mock setup
    // In a real implementation, we would need to send Better Auth session info to get a JWT
    console.warn('No token available. You may need to authenticate first.');
    return null;
  }

  // Get authorization header with JWT token
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getValidToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...options.headers, ...(await this.getAuthHeaders()) };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Task-related API methods
  async getTasks(status?: 'all' | 'pending' | 'completed', sort?: 'created' | 'title'): Promise<Task[]> {
    let url = '/api/tasks';
    const params = new URLSearchParams();

    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (sort) {
      params.append('sort', sort);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.request<Task[]>(url, { method: 'GET' });
  }

  async createTask(data: TaskCreateData): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTask(id: number): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, { method: 'GET' });
  }

  async updateTask(id: number, data: TaskUpdateData): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.request<void>(`/api/tasks/${id}`, { method: 'DELETE' });
  }

  async toggleTaskCompletion(id: number, completed: boolean): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  }

  async getTaskAnalytics(): Promise<{
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    completion_rate: number;
  }> {
    return this.request('/api/tasks/analytics', { method: 'GET' });
  }
}

// Authentication methods
class AuthApiClient extends ApiClient {
  async login(email: string, password: string): Promise<void> {
    // In a real implementation, this would call the backend login endpoint
    // For this demo, we'll simulate the authentication flow

    // First, we would typically authenticate with Better Auth to establish a session
    // Then we'd get a JWT token from the backend

    // For this mock implementation, we'll create a mock token
    const mockToken = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('mock-jwt-token', mockToken);
    this.setToken(mockToken);
  }

  async register(email: string, password: string): Promise<void> {
    // Mock registration implementation
    await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('jwt-token');
    this.token = null;
  }

  async getAuthToken(): Promise<string | null> {
    // Get token from localStorage or API
    const storedToken = localStorage.getItem('jwt-token');
    if (storedToken) {
      this.setToken(storedToken);
      return storedToken;
    }
    return null;
  }
}

// Create a singleton instance
export const api = new AuthApiClient();

// Export the types for use in components
export type { Task, TaskCreateData, TaskUpdateData };
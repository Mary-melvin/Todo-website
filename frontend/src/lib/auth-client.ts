// Real auth client implementation that works with backend auth endpoints
import { useRouter } from 'next/navigation';

interface AuthResponse {
  jwt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

class AuthClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Login failed: ${response.status}`);
    }

    return response.json();
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Registration failed: ${response.status}`);
    }

    return response.json();
  }

  async logout(): Promise<void> {
    // Clear any stored tokens
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('user-info');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('jwt-token');
  }

  setStoredToken(token: string): void {
    localStorage.setItem('jwt-token', token);
  }

  clearStoredToken(): void {
    localStorage.removeItem('jwt-token');
  }
}

export const authClient = new AuthClient();

// Export functions for authentication
export const useSession = () => {
  const token = authClient.getStoredToken();
  return {
    data: token ? { token } : null,
    status: token ? 'authenticated' : 'unauthenticated',
  };
};

export const useSignIn = () => {
  const router = useRouter();

  return {
    signIn: async (credentials: LoginCredentials) => {
      try {
        const { jwt } = await authClient.login(credentials);
        authClient.setStoredToken(jwt);
        router.push('/dashboard');
        return { success: true };
      } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Sign in failed' };
      }
    },
  };
};

export const useSignOut = () => {
  const router = useRouter();

  return {
    signOut: async () => {
      await authClient.logout();
      router.push('/');
      return { success: true };
    },
  };
};

export const useSignUp = () => {
  const router = useRouter();

  return {
    signUp: async (credentials: RegisterCredentials) => {
      try {
        const { jwt } = await authClient.register(credentials);
        authClient.setStoredToken(jwt);
        router.push('/dashboard');
        return { success: true };
      } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Sign up failed' };
      }
    },
  };
};
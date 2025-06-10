import axios from 'axios';

// Define the base API URL
const BASE_API_URL = 'https://9b8a-2a09-bac5-56ba-18be-00-277-94.ngrok-free.app';

// Define types for the auth responses
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  balance?: number;
  isVerified?: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Setup axios instance with interceptors
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userData = authService.getCurrentUser();
    if (userData && userData.access_token) {
      config.headers['Authorization'] = `Bearer ${userData.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const userData = authService.getCurrentUser();
        if (userData?.refresh_token) {
          const newTokens = await authService.refreshToken(userData.refresh_token);
          originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const authService = {
  // Register a new reseller
  register: async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${BASE_API_URL}/auth/register`, {
        ...userData,
        role: 'RESELLER'
      });

      const authResponse: AuthResponse = {
        access_token: response.data.token,
        refresh_token: response.data.refresh_token,
        user: response.data.user
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(authResponse));
      
      return authResponse;
    } catch (error: any) {
      throw { message: error.response?.data?.message || 'Registration failed' };
    }
  },

  // Login reseller
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${BASE_API_URL}/auth/login`, {
        email,
        password
      });

      const authResponse: AuthResponse = {
        access_token: response.data.token,
        refresh_token: response.data.refresh_token,
        user: response.data.user
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(authResponse));
      
      return authResponse;
    } catch (error: any) {
      throw { message: error.response?.data?.message || 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Get current user data from localStorage
  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/auth/verify-otp`, {
        email,
        otp
      });
      
      return { success: true, message: response.data.message };
    } catch (error: any) {
      throw { message: error.response?.data?.message || 'OTP verification failed' };
    }
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/auth/forgot-password`, {
        email
      });
      
      return { 
        success: true, 
        message: response.data.message
      };
    } catch (error: any) {
      throw { message: error.response?.data?.message || 'Failed to send reset email' };
    }
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/auth/reset-password`, {
        token,
        password
      });
      
      return { success: true, message: response.data.message };
    } catch (error: any) {
      throw { message: error.response?.data?.message || 'Password reset failed' };
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${BASE_API_URL}/auth/refresh-token`, {
        refresh_token: refreshToken
      });

      const updatedUserData = {
        access_token: response.data.token,
        refresh_token: response.data.refresh_token,
        user: response.data.user
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      return updatedUserData;
    } catch (error: any) {
      throw { message: error.response?.data?.message || 'Token refresh failed' };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data.user;
    } catch (error: any) {
      throw { message: error.response?.data?.message || 'Failed to get profile' };
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const userData = authService.getCurrentUser();
    return !!userData && !!userData.access_token;
  },
  
  // Get user info
  getUserInfo: (): User | null => {
    const userData = authService.getCurrentUser();
    return userData ? userData.user : null;
  },

  // Check if user is reseller
  isReseller: (): boolean => {
    const user = authService.getUserInfo();
    return user?.role === 'RESELLER' || user?.role === 'reseller';
  }
};

export default authService;
import axios from 'axios';
import authService from './authService';

const API_URL = 'https://9b8a-2a09-bac5-56ba-18be-00-277-94.ngrok-free.app';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user && user.access_token) {
      config.headers['Authorization'] = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const user = authService.getCurrentUser();
        if (user && user.refresh_token) {
          const response = await authService.refreshToken(user.refresh_token);
          
          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.access_token}`;
          
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout the user
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
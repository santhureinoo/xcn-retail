import { useState, useEffect } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getUserInfo();
      
      setAuthState({
        isAuthenticated: isAuth,
        user: user,
        loading: false
      });
    };

    checkAuthStatus();
    
    // Listen for storage events (for multi-tab logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return authState;
};
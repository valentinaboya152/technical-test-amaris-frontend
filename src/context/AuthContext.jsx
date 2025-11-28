import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenService } from '../services/auth/tokenService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = tokenService.getAccessToken();
      if (accessToken) {
        // Simulamos un usuario básico con el token
        setUser({ email: 'usuario@ejemplo.com' });
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = async (accessToken, refreshToken) => {
    try {
      // Save tokens
      tokenService.setAccessToken(accessToken);
      tokenService.setRefreshToken(refreshToken);
      
      // Simulamos un usuario básico
      setUser({ email: 'usuario@ejemplo.com' });
      setIsAuthenticated(true);
      setError(null);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
      logoutUser();
      throw error;
    }
  };

  const logoutUser = () => {
    // Clear tokens and user data
    tokenService.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

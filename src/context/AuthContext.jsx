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
    const checkAuth = async () => {
      try {
        const accessToken = tokenService.getAccessToken();
        if (accessToken) {
          // Try to get user data from the server or decode token
          // For now, we'll just set a basic user object
          setUser({ email: 'usuario@ejemplo.com' });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear invalid tokens
        tokenService.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (responseData) => {
    try {
      // Extract tokens from response data
      const accessToken = responseData.access_token || responseData.accessToken;
      const refreshToken = responseData.refresh_token || responseData.refreshToken;
      
      if (!accessToken) {
        throw new Error('No access token received');
      }
      
      // Save tokens
      tokenService.setAccessToken(accessToken);
      if (refreshToken) {
        tokenService.setRefreshToken(refreshToken);
      }
      
      // Try to extract user info from the token
      try {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        setUser({ 
          email: tokenData.email || tokenData.sub || 'usuario@ejemplo.com',
          ...tokenData
        });
      } catch (e) {
        console.warn('Could not parse token, using default user');
        setUser({ email: 'usuario@ejemplo.com' });
      }
      
      setIsAuthenticated(true);
      setError(null);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Error during login');
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

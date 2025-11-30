import axios from 'axios';
import { API_BASE_URL } from '@/configs/apiConfig';
import { tokenService } from '@/services/auth/tokenService';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 400; // Resolve only if status code is less than 400
  },
});

// Add a request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      // Ensure the token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          // No refresh token available, redirect to login
          tokenService.clearTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        try {
          // Try to refresh the token using the refresh token endpoint
          const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          if (access) {
            tokenService.setAccessToken(access);
            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${access}`;
            // Retry the original request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, clear tokens and redirect to login
          tokenService.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } catch (err) {
        console.error('Error in refresh token flow:', err);
        tokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    // If the error is 403, the refresh token might be invalid
    if (error.response?.status === 403) {
      tokenService.clearTokens();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

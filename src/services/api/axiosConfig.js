// src/services/api/axiosConfig.js
import axios from 'axios';
import { API_BASE_URL } from '@/configs/apiConfig';
import { tokenService } from '@/services/auth/tokenService';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 y no es una petición de refresh
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('refresh-token')) {
      
      originalRequest._retry = true;
      
      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Usar el authService para refrescar el token
        const authService = (await import('@/services/authServices/authService')).authService;
        const tokens = await authService.refreshToken(refreshToken);
        
        // Guardar el nuevo access token
        const newAccessToken = tokens.access || tokens.accessToken;
        tokenService.setAccessToken(newAccessToken);
        
        // Actualizar el header de autorización
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Reintentar la petición original
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Limpiar tokens y redirigir a login
        tokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
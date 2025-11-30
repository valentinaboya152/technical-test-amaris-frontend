// src/services/clientService.js
import axios from 'axios';
import { API_BASE_URL } from '@/configs/apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Añadir el token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const clientService = {
  async getClientInfo() {
    try {
      const response = await apiClient.get('/api/clients/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching client info:', error);
      throw error;
    }
  }
};
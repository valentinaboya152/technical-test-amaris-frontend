import axios from 'axios';
import { API_BASE_URL } from '@/configs/apiConfig';

/**
 * Servicio para gestionar la autenticación de usuarios
 */
export const registerUserService = {
  /**
   * Inicia sesión con credenciales de usuario
   
   * @returns {Promise<Object>} - Tokens de autenticación (access y refresh)
   */
  async register(userData) {
    try {
      // Ensure all string fields are properly formatted
      const formattedData = {
        full_name: userData.full_name,
        nit: userData.nit,
        email: userData.email,
        phone: userData.phone,
        username: userData.username,
        password: userData.password
      };

      console.log('Sending registration data to server:', formattedData);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          validateStatus: status => status < 500
        }
      );
      
      // If we get a successful response, return the data
      if (response.status >= 200 && response.status < 300) {
        console.log('Register successful:', response.data);
        return response.data;
      }
      
      // If we get a validation error (422), throw the entire response
      if (response.status === 422) {
        const error = new Error('Validation error');
        error.response = response;
        throw error;
      }
      
      // For other error statuses
      throw new Error(response.data?.message || 'Error en el registro');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // If we have a response with validation errors, rethrow it
      if (error.response?.status === 422) {
        throw error;
      }
      
      // Handle other types of errors
      if (error.response) {
        // Server responded with a status code outside 2xx
        if (error.response.status === 401) {
          throw new Error('Credenciales incorrectas');
        } else if (error.response.status === 403) {
          throw new Error('Usuario no autorizado');
        } else if (error.response.status === 409) {
          throw new Error('El correo electrónico ya está registrado');
        } else if (error.response.status === 423) {
          throw new Error('Cuenta bloqueada. Contacte al administrador');
        } else {
          throw new Error(error.response.data?.message || 'Error en el servidor');
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No se pudo contactar al servidor. Verifique su conexión');
      } else {
        // Error setting up the request
        throw new Error('Error al procesar la solicitud');
      }
    }
  },
};

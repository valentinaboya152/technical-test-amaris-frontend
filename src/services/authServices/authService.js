import axios from 'axios';
import { API_BASE_URL } from '../../configs/apiConfig.js';

/**
 * Servicio para gestionar la autenticación de usuarios
 */
export const authService = {
  /**
   * Inicia sesión con credenciales de usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Tokens de autenticación (access y refresh)
   */
  async login(username, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      
      // Ensure we have the expected response format
      if (!response.data || (!response.data.access_token && !response.data.accessToken)) {
        throw new Error('Invalid response format from server');
      }
      
      return response.data;
    } catch (error) {
      // Manejo detallado de errores específicos de la API
      if (error.response) {
        // El servidor respondió con un código de estado diferente de 2xx
        if (error.response.status === 401) {
          throw new Error('Credenciales incorrectas');
        } else if (error.response.status === 403) {
          throw new Error('Usuario no autorizado');
        } else if (error.response.status === 423) {
          throw new Error('Cuenta bloqueada. Contacte al administrador');
        } else {
          throw new Error(error.response.data?.message || 'Error en el servidor');
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        throw new Error('No se pudo contactar al servidor. Verifique su conexión');
      } else {
        // Error al configurar la petición
        throw new Error('Error al procesar la solicitud');
      }
    }
  },
  
  /**
   * Refresca el access token usando el refresh token
   * @param {string} refreshToken - Token de refresco
   * @returns {Promise<Object>} - Nuevo access token
   */
  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
        refresh: refreshToken
      });
      
      console.log("Respuesta del refresh token:", response.data);
      
      // Verificar que la respuesta tenga el formato esperado
      if (!response.data.access && !response.data.accessToken) {
        console.error("Formato de respuesta inválido:", response.data);
        throw new Error("Formato de respuesta inválido");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error en refreshToken:", error);
      if (error.response && error.response.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente');
      }
      throw new Error('Error al renovar la sesión');
    }
  },
  
  /**
   * Cierra la sesión del usuario
   * @param {string} accessToken - Access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<void>}
   */
  async logout(accessToken, refreshToken) {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, 
        { refreshToken }, // Enviamos el refresh token en el body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Incluso si hay error, eliminaremos los tokens localmente
    }
  },
};

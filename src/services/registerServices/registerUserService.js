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
  async register(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      
      console.log('Register response:', response.data); // Para depuración
      // Asumimos que el backend responde con { accessToken, refreshToken }
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
};

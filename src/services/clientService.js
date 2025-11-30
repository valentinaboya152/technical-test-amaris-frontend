import apiClient from './axiosConfig';

const clientService = {
  // Get current client information
  async getClientInfo() {
    try {
      const response = await apiClient.get('/api/clients/me/');
      return response.data;
    } catch (error) {
      console.error('Error fetching client info:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await apiClient.post('/api/auth/logout/');
      // Clear any stored tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
};

export default clientService;

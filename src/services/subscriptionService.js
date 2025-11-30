import apiClient from '@/utils/axiosConfig';

const subscriptionService = {
  // Create a new subscription
  async createSubscription(fundId, notificationPreference = 'EMAIL') {
    try {
      const response = await apiClient.post(
        '/api/subscriptions/subscriptions-new/',
        {
          fund_id: fundId,
          notification_preference: notificationPreference
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      
      // If we have a response with data, throw the entire error object
      if (error.response?.data) {
        // If the data is a string, try to parse it as JSON
        if (typeof error.response.data === 'string') {
          try {
            error.response.data = JSON.parse(error.response.data);
          } catch (e) {
            // If parsing fails, keep the string as is
            error.response.data = { message: error.response.data };
          }
        }
        throw error; // Re-throw the error to be handled by the component
      }
      
      // For network errors or other issues, throw a generic error
      throw new Error('Error al crear la suscripción. Por favor, intente de nuevo.');
    }
  },

  // Cancel a subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await apiClient.post(
        `/api/subscriptions/subscriptions/${subscriptionId}/cancel/`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error(error.response?.data?.message || 'Error al cancelar la suscripción');
    }
  },

  // Get all subscriptions
  async getSubscriptions() {
    try {
      const response = await apiClient.get('/api/subscriptions/subscriptions-list/');
      console.log('Raw subscriptions response:', response);
      
      // Return the data exactly as it comes from the backend
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar las suscripciones');
    }
  }
};

export default subscriptionService;

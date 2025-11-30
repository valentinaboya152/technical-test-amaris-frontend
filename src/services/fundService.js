import apiClient from '@/utils/axiosConfig';

const fundService = {
  // Get all available funds
  async getFunds() {
    try {
      console.log('Fetching funds from API...');
      const response = await apiClient.get('/api/funds/funds-list/');
      
      console.log('Funds API Response:', response);
      
      // Check if response.data exists and contains an items array
      let fundsData = [];
      
      if (response.data && typeof response.data === 'object') {
        // Check for items array in the response
        if (Array.isArray(response.data.items)) {
          fundsData = response.data.items;
        } 
        // Fallback to other common array properties if items is not found
        else if (Array.isArray(response.data.results)) {
          fundsData = response.data.results;
        } else if (Array.isArray(response.data.data)) {
          fundsData = response.data.data;
        } else if (Array.isArray(response.data.funds)) {
          fundsData = response.data.funds;
        }
      }
      
      if (!fundsData || !Array.isArray(fundsData)) {
        console.error('Invalid funds data format:', response.data);
        throw new Error('Formato de respuesta inválido del servidor');
      }
      
      // Ensure each fund has an id and name
      const formattedFunds = fundsData.map((fund, index) => ({
        id: fund.id || `fund-${index}`,
        name: fund.name || `Fondo ${index + 1}`,
        ...fund
      }));
      
      return formattedFunds;
    } catch (error) {
      console.error('Error fetching funds:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar los fondos');
    }
  },
};

export default fundService;

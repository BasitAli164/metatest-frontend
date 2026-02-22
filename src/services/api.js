import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  // Run a metamorphic test
  runTest: async (testData) => {
    try {
      console.log('Sending test data:', testData); // Debug log
      const response = await axios.post(`${API_BASE_URL}/tests/run`, testData);
      console.log('Test response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get all test results
  getResults: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_BASE_URL}/tests/results?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get analytics data
  getAnalytics: async (modelId = '') => {
    try {
      const url = modelId 
        ? `${API_BASE_URL}/tests/analytics?modelId=${modelId}`
        : `${API_BASE_URL}/tests/analytics`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get available models
  getModels: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tests/models`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search models (for load more functionality)
  searchModels: async (task, limit = 5) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tests/search-models`, {
        params: { task, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }
};

export default api;
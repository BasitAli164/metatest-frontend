import axios from 'axios';

// Use environment variable or fallback to Railway URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://metatest-backend-production.up.railway.app/api';

const api = {
  // Run a metamorphic test
  runTest: async (testData) => {
    try {
      console.log('Sending test data:', testData);
      const response = await axios.post(`${API_BASE_URL}/tests/run`, testData);
      console.log('Test response:', response.data);
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

  // 👇 NEW FUNCTION - Get MR Types
  getMRTypes: async (category = '') => {
    try {
      const url = category 
        ? `${API_BASE_URL}/tests/mr-types?category=${category}`
        : `${API_BASE_URL}/tests/mr-types`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch MR types:', error);
      // Fallback to static list if API fails
      return {
        success: true,
        data: [
          { value: 'SYNONYM', label: 'Synonym Replacement', description: 'Tests semantic consistency', icon: '🔄', color: 'blue' },
          { value: 'GENDER_SWAP', label: 'Gender Swap', description: 'Fairness & bias check', icon: '⚥', color: 'purple' },
          { value: 'PUNCTUATION', label: 'Punctuation', description: 'Robustness check', icon: '❗', color: 'yellow' },
          { value: 'NEGATION', label: 'Negation', description: 'Logical consistency', icon: '🚫', color: 'red' },
          { value: 'PARAPHRASE', label: 'Paraphrase', description: 'Semantic invariance', icon: '📝', color: 'green' }
        ]
      };
    }
  },

  // Search models by task
  searchModels: async (task, limit = 5) => {
    try {
      const response = await axios.get(`https://huggingface.co/api/models?pipeline_tag=${task}&sort=downloads&limit=${limit}`);
      return response.data.map(model => ({
        id: model.id,
        name: model.id.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        task: task,
        isDynamic: true
      }));
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  },

  // Search models by query
  searchModelsByQuery: async (query) => {
    try {
      const response = await axios.get(`https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=15`);
      return response.data.map(model => {
        let task = 'unknown';
        if (model.pipeline_tag) {
          if (model.pipeline_tag.includes('sentiment') || model.pipeline_tag.includes('text-classification')) {
            task = 'sentiment';
          } else if (model.pipeline_tag.includes('zero-shot')) {
            task = 'zero-shot';
          } else if (model.pipeline_tag.includes('text-generation')) {
            task = 'text-generation';
          }
        }
        return {
          id: model.id,
          name: model.id.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          task: task,
          isDynamic: true
        };
      });
    } catch (error) {
      console.error('Query search failed:', error);
      return [];
    }
  }
};

export default api;
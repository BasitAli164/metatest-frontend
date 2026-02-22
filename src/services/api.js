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

  // 🔴 UPDATE THIS FUNCTION - Search models by task (for More button)
  searchModels: async (task, limit = 5) => {
    try {
      // Direct Hugging Face API call (more reliable)
      const response = await axios.get(`https://huggingface.co/api/models?pipeline_tag=${task}&sort=downloads&limit=${limit}`);
      
      // Transform response to our format
      return response.data.map(model => ({
        id: model.id,
        name: model.id.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        task: task,
        isDynamic: true,
        downloads: model.downloads || 0,
        likes: model.likes || 0
      }));
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  },

  // 🟢 NEW FUNCTION 1 - Search models by query (for search input)
  searchModelsByQuery: async (query) => {
    try {
      // Direct Hugging Face API call
      const response = await axios.get(`https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=15`);
      
      // Transform response
      return response.data.map(model => {
        // Determine task from pipeline_tag
        let task = 'unknown';
        if (model.pipeline_tag) {
          if (model.pipeline_tag.includes('sentiment') || model.pipeline_tag.includes('text-classification')) {
            task = 'sentiment';
          } else if (model.pipeline_tag.includes('zero-shot')) {
            task = 'zero-shot';
          } else if (model.pipeline_tag.includes('text-generation')) {
            task = 'text-generation';
          } else if (model.pipeline_tag.includes('translation')) {
            task = 'translation';
          } else {
            task = model.pipeline_tag;
          }
        }
        
        return {
          id: model.id,
          name: model.id.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          task: task,
          isDynamic: true,
          downloads: model.downloads || 0,
          likes: model.likes || 0
        };
      });
    } catch (error) {
      console.error('Query search failed:', error);
      return [];
    }
  },

  // 🟢 NEW FUNCTION 2 - Get models by task with dynamic loading
  getDynamicModels: async (task, limit = 5) => {
    try {
      // Try backend first
      try {
        const response = await axios.get(`${API_BASE_URL}/tests/models`, {
          params: { task, includeDynamic: true }
        });
        if (response.data.success && response.data.data.length > 0) {
          return response.data.data;
        }
      } catch (backendError) {
        console.log('Backend fetch failed, trying direct HF API');
      }
      
      // Fallback to direct Hugging Face API
      return await api.searchModels(task, limit);
    } catch (error) {
      console.error('Get dynamic models failed:', error);
      return [];
    }
  },
  // Add this new function
getMRTypes: async (category = '') => {
  try {
    const url = category 
      ? `${API_BASE_URL}/tests/mr-types?category=${category}`
      : `${API_BASE_URL}/tests/mr-types`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch MR types:', error);
    // Fallback to static list
    return {
      success: true,
      data: [
        { value: 'SYNONYM', label: 'Synonym Replacement', icon: '🔄' },
        { value: 'GENDER_SWAP', label: 'Gender Swap', icon: '⚥' },
        { value: 'PUNCTUATION', label: 'Punctuation', icon: '❗' },
        { value: 'NEGATION', label: 'Negation', icon: '🚫' },
        { value: 'PARAPHRASE', label: 'Paraphrase', icon: '📝' }
      ]
    };
  }
},

  
};


export default api;
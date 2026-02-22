import React, { useState, useEffect } from 'react';
import { 
  Send, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  ChevronDown,
  CheckCircle,
  Info
} from 'lucide-react';
import api from '../services/api';

const TestInput = ({ onSubmit, isLoading, selectedModel }) => {
  const [sourceInput, setSourceInput] = useState('');
  const [mrType, setMrType] = useState('');
  const [error, setError] = useState('');
  const [mrTypes, setMrTypes] = useState([]);
  const [loadingMrTypes, setLoadingMrTypes] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch MR types from backend
  useEffect(() => {
    fetchMRTypes();
  }, []);

  const fetchMRTypes = async () => {
    try {
      const response = await api.getMRTypes();
      if (response.success && response.data.length > 0) {
        setMrTypes(response.data);
        setMrType(response.data[0].value); // Set first as default
      } else {
        // Fallback to static list if API fails
        const fallbackTypes = [
          { value: 'SYNONYM', label: 'Synonym Replacement', description: 'Tests semantic consistency by replacing words with synonyms', icon: '🔄', color: 'blue' },
          { value: 'GENDER_SWAP', label: 'Gender Swap', description: 'Fairness & bias check by swapping gender-specific terms', icon: '⚥', color: 'purple' },
          { value: 'PUNCTUATION', label: 'Punctuation Perturbation', description: 'Robustness check by modifying punctuation', icon: '❗', color: 'yellow' },
          { value: 'NEGATION', label: 'Negation', description: 'Logical consistency by adding/removing negation', icon: '🚫', color: 'red' },
          { value: 'PARAPHRASE', label: 'Paraphrase', description: 'Semantic invariance through rephrasing', icon: '📝', color: 'green' }
        ];
        setMrTypes(fallbackTypes);
        setMrType(fallbackTypes[0].value);
      }
    } catch (error) {
      console.error('Error fetching MR types:', error);
      // Fallback static list
      const fallbackTypes = [
        { value: 'SYNONYM', label: 'Synonym Replacement', description: 'Tests semantic consistency by replacing words with synonyms', icon: '🔄', color: 'blue' },
        { value: 'GENDER_SWAP', label: 'Gender Swap', description: 'Fairness & bias check by swapping gender-specific terms', icon: '⚥', color: 'purple' },
        { value: 'PUNCTUATION', label: 'Punctuation Perturbation', description: 'Robustness check by modifying punctuation', icon: '❗', color: 'yellow' },
        { value: 'NEGATION', label: 'Negation', description: 'Logical consistency by adding/removing negation', icon: '🚫', color: 'red' },
        { value: 'PARAPHRASE', label: 'Paraphrase', description: 'Semantic invariance through rephrasing', icon: '📝', color: 'green' }
      ];
      setMrTypes(fallbackTypes);
      setMrType(fallbackTypes[0].value);
    } finally {
      setLoadingMrTypes(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedModel) {
      setError('Please select a model first');
      return;
    }
    
    if (!sourceInput || !sourceInput.trim()) {
      setError('Please enter a test input');
      return;
    }
    
    onSubmit({ 
      sourceInput: sourceInput.trim(), 
      MRType: mrType 
    });
    
    setSourceInput('');
  };

  const fillExample = (example) => {
    setSourceInput(example);
    setError('');
  };

  const selectedMR = mrTypes.find(t => t.value === mrType);

  // Get color classes based on MR type color
  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
      red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400',
    };
    return colorMap[color] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header with gradient */}
      <div className="relative p-6 border-b border-gray-700/50">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none"></div>
        
        <div className="relative flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl border border-primary-500/30">
            <Sparkles className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Metamorphic Test
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Apply transformations to validate model reliability
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Model Warning */}
        {!selectedModel && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">Please select a model from the dropdown above to begin testing</p>
            </div>
          </div>
        )}
        
        {/* MR Type Selection - Beautiful Dropdown */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Metamorphic Relation
          </label>
          
          {loadingMrTypes ? (
            <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <RefreshCw className="w-5 h-5 animate-spin text-primary-500" />
              <span className="text-sm text-gray-400">Loading MR types...</span>
            </div>
          ) : (
            <div className="relative">
              {/* Custom Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-left flex items-center justify-between hover:border-primary-500/50 transition-all duration-300 group"
              >
                {selectedMR ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedMR.icon}</span>
                    <div>
                      <p className="font-medium text-white">{selectedMR.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{selectedMR.description}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Select a metamorphic relation</span>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                    {/* Dropdown Header */}
                    <div className="p-3 bg-gradient-to-r from-primary-900/30 to-primary-800/10 border-b border-gray-700">
                      <h3 className="text-sm font-medium text-white">Available Metamorphic Relations</h3>
                      <p className="text-xs text-gray-400 mt-1">Select a transformation type</p>
                    </div>

                    {/* MR Types List */}
                    <div className="max-h-80 overflow-y-auto">
                      {mrTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setMrType(type.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full p-4 text-left hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-700 last:border-0 ${
                            mrType === type.value ? `bg-${type.color}-900/20` : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{type.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{type.label}</h4>
                                {mrType === type.value && (
                                  <CheckCircle className={`w-5 h-5 text-${type.color}-500`} />
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{type.description}</p>
                              
                              {/* Color indicator */}
                              <div className={`mt-2 w-16 h-1 rounded-full bg-gradient-to-r ${getColorClasses(type.color).split(' ')[0]}`}></div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Dropdown Footer */}
                    <div className="p-3 bg-gray-900/50 border-t border-gray-700">
                      <p className="text-xs text-gray-500 text-center">
                        {mrTypes.length} transformation types available
                      </p>
                    </div>
                  </div>
                  
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                </>
              )}
            </div>
          )}

          {/* Selected MR Info Card */}
          {selectedMR && !isDropdownOpen && (
            <div className={`p-4 bg-gradient-to-r ${getColorClasses(selectedMR.color)} rounded-xl border mt-3`}>
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">About this transformation:</p>
                  <p className="text-xs mt-1 opacity-90">{selectedMR.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Source Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Source Input
          </label>
          <div className="relative">
            <textarea
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              placeholder="Enter text to test..."
              rows="4"
              className={`w-full bg-gray-800/50 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none`}
              disabled={isLoading}
            />
            
            {/* Character count */}
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {sourceInput.length} characters
            </div>
          </div>
          
          {/* Example buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillExample("The movie was absolutely fantastic!")}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg border border-gray-700 transition-colors flex items-center space-x-1"
            >
              <span>🎬</span>
              <span>Movie</span>
            </button>
            <button
              type="button"
              onClick={() => fillExample("He is a brilliant scientist")}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg border border-gray-700 transition-colors flex items-center space-x-1"
            >
              <span>👨‍🔬</span>
              <span>Gender</span>
            </button>
            <button
              type="button"
              onClick={() => fillExample("I love this product!!!")}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg border border-gray-700 transition-colors flex items-center space-x-1"
            >
              <span>⭐</span>
              <span>Product</span>
            </button>
            <button
              type="button"
              onClick={() => fillExample("This is not bad at all")}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg border border-gray-700 transition-colors flex items-center space-x-1"
            >
              <span>🚫</span>
              <span>Negation</span>
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedModel || !mrType}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 group"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Running Test...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Execute Metamorphic Test</span>
              {selectedMR && (
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                  {selectedMR.icon}
                </span>
              )}
            </>
          )}
        </button>
        
        {/* Quick Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${selectedModel ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            <span>Model: {selectedModel ? 'Selected' : 'None'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${mrType ? 'bg-primary-500' : 'bg-gray-500'}`}></span>
            <span>MR Type: {selectedMR ? selectedMR.label.split(' ')[0] : 'None'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${sourceInput.length > 0 ? 'bg-blue-500' : 'bg-gray-500'}`}></span>
            <span>Input: {sourceInput.length} chars</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TestInput;
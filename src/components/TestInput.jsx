import React, { useState } from 'react';
import { Send, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

const MR_TYPES = [
  { 
    value: 'SYNONYM', 
    label: 'Synonym Replacement', 
    description: 'Tests semantic consistency by replacing words with synonyms',
    icon: '🔄',
    color: 'blue'
  },
  { 
    value: 'GENDER_SWAP', 
    label: 'Gender Swap', 
    description: 'Fairness & bias check by swapping gender-specific terms',
    icon: '⚥',
    color: 'purple'
  },
  { 
    value: 'PUNCTUATION', 
    label: 'Punctuation Perturbation', 
    description: 'Robustness check by modifying punctuation',
    icon: '❗',
    color: 'yellow'
  },
  { 
    value: 'NEGATION', 
    label: 'Negation', 
    description: 'Logical consistency by adding/removing negation',
    icon: '🚫',
    color: 'red'
  },
  { 
    value: 'PARAPHRASE', 
    label: 'Paraphrase', 
    description: 'Semantic invariance through rephrasing',
    icon: '📝',
    color: 'green'
  }
];

const TestInput = ({ onSubmit, isLoading, selectedModel }) => {
  const [sourceInput, setSourceInput] = useState('');
  const [mrType, setMrType] = useState('SYNONYM');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError('');
    
    // Check if model is selected
    if (!selectedModel) {
      setError('Please select a model first');
      return;
    }
    
    // Check if input is empty or just whitespace
    if (!sourceInput || !sourceInput.trim()) {
      setError('Please enter a test input');
      return;
    }
    
    // Call the onSubmit prop with the test data
    onSubmit({ 
      sourceInput: sourceInput.trim(), 
      MRType: mrType 
    });
    
    // Clear the input after successful submission
    setSourceInput('');
  };

  // Pre-fill with example text for testing
  const fillExample = (example) => {
    setSourceInput(example);
    setError(''); // Clear any error when filling example
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-primary-500" />
        Run Metamorphic Test
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Model Warning */}
        {!selectedModel && (
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">Please select a model from the dropdown above</p>
            </div>
          </div>
        )}
        
        {/* MR Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Metamorphic Relation
          </label>
          <select
            value={mrType}
            onChange={(e) => setMrType(e.target.value)}
            className="input-field"
            disabled={isLoading}
          >
            {MR_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-400">
            {MR_TYPES.find(t => t.value === mrType)?.description}
          </p>
        </div>
        
        {/* Source Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Source Input
          </label>
          <textarea
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            placeholder="e.g., The movie was great!"
            rows="4"
            className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isLoading}
          />
          
          {/* Example buttons */}
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillExample("The movie was absolutely fantastic!")}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
            >
              🎬 Movie review
            </button>
            <button
              type="button"
              onClick={() => fillExample("He is a brilliant scientist")}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
            >
              👨‍🔬 Gender test
            </button>
            <button
              type="button"
              onClick={() => fillExample("I love this product!!!")}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
            >
              ⭐ Product review
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedModel}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running Test...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Execute Metamorphic Test</span>
            </>
          )}
        </button>
        
        {/* Debug Info - Remove in production */}
        <div className="text-xs text-gray-600 text-center mt-2">
          Selected Model: {selectedModel || 'None'} | Input Length: {sourceInput.length}
        </div>
      </form>
    </div>
  );
};

export default TestInput;
import React, { useState } from "react";
import { 
  Cpu, 
  ChevronDown, 
  RefreshCw, 
  Search, 
  Loader,
  Sparkles,
  Database,
  Star,
  Download,
  ThumbsUp,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const ModelSelector = ({ models, selectedModel, onSelect, onModelsUpdate }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const loadMoreModels = async () => {
    setIsLoadingMore(true);
    try {
      const tasks = [
        "sentiment",
        "zero-shot-classification",
        "text-generation",
        "translation",
        "summarization",
      ];
      let allNewModels = [];

      for (const task of tasks) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/tests/models?includeDynamic=true&task=${task}`,
          );
          const data = await response.json();

          if (data.success && data.data.length > 0) {
            const modelsWithTask = data.data.map((model) => ({
              ...model,
              task: task,
            }));
            allNewModels = [...allNewModels, ...modelsWithTask];
          }
        } catch (err) {
          console.log(`Error fetching ${task} models:`, err);
        }
      }

      const existingIds = new Set(models.map((m) => m.id));
      const uniqueNewModels = allNewModels.filter(
        (m) => !existingIds.has(m.id),
      );

      if (uniqueNewModels.length > 0) {
        onModelsUpdate([...models, ...uniqueNewModels]);
        toast.success(
          `✨ Added ${uniqueNewModels.length} new models from Hugging Face!`,
          {
            icon: '🚀',
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #3b82f6'
            }
          }
        );
      } else {
        toast("No new models found - try searching instead!", { 
          icon: "🔍",
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #f59e0b'
          }
        });
      }
    } catch (error) {
      console.error("Load more error:", error);
      toast.error("Failed to load more models");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const searchModels = async () => {
    if (!searchTerm.trim()) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(
        `https://huggingface.co/api/models?search=${encodeURIComponent(searchTerm)}&limit=10`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const newModels = data.map((model) => {
          let task = "unknown";
          if (model.pipeline_tag) {
            if (
              model.pipeline_tag.includes("sentiment") ||
              model.pipeline_tag.includes("text-classification")
            ) {
              task = "sentiment";
            } else if (model.pipeline_tag.includes("zero-shot")) {
              task = "zero-shot";
            } else if (model.pipeline_tag.includes("text-generation")) {
              task = "text-generation";
            } else if (model.pipeline_tag.includes("translation")) {
              task = "translation";
            } else {
              task = model.pipeline_tag;
            }
          }

          return {
            id: model.id,
            name: model.id
              .split("/")
              .pop()
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            task: task,
            isDynamic: true,
            downloads: model.downloads || 0,
            likes: model.likes || 0,
          };
        });

        const existingIds = new Set(models.map((m) => m.id));
        const uniqueNewModels = newModels.filter((m) => !existingIds.has(m.id));

        if (uniqueNewModels.length > 0) {
          onModelsUpdate([...models, ...uniqueNewModels]);
          toast.success(
            `🔍 Found ${uniqueNewModels.length} models matching "${searchTerm}"`,
            {
              icon: '🎯',
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #10b981'
              }
            }
          );
          setSearchTerm("");
          setShowSearch(false);
        } else {
          toast(`No new models found for "${searchTerm}"`, { 
            icon: "ℹ️",
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #6b7280'
            }
          });
        }
      } else {
        toast(`No models found for "${searchTerm}"`, { 
          icon: "ℹ️",
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #6b7280'
          }
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed - please try again");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getTaskIcon = (task) => {
    switch(task) {
      case 'sentiment': return '😊';
      case 'zero-shot': return '🎯';
      case 'text-generation': return '📝';
      case 'translation': return '🌐';
      default: return '🤖';
    }
  };

  const getTaskColor = (task) => {
    switch(task) {
      case 'sentiment': return 'blue';
      case 'zero-shot': return 'purple';
      case 'text-generation': return 'green';
      case 'translation': return 'yellow';
      default: return 'gray';
    }
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header with gradient */}
      <div className="relative p-6 border-b border-gray-700/50">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl border border-primary-500/30">
              <Cpu className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Model Selection
              </h2>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <Database className="w-3 h-3 mr-1" />
                {models.length} models available
              </p>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-green-400 font-medium">Connected to HF</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 space-y-4">
        {/* Selected Model Card or Dropdown Trigger */}
        {selectedModelData ? (
          <div className="group relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            
            <div className="relative p-5 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-primary-500/30 rounded-xl shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Large icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-500/30 blur-md rounded-full"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500/30 to-primary-600/30 rounded-xl flex items-center justify-center border-2 border-primary-500/50 text-3xl">
                      {getTaskIcon(selectedModelData.task)}
                    </div>
                  </div>
                  
                  {/* Model details */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{selectedModelData.name}</h3>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                        Active
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 font-mono mb-3 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700 inline-block">
                      {selectedModelData.id}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 bg-${getTaskColor(selectedModelData.task)}-900/50 text-${getTaskColor(selectedModelData.task)}-300 text-xs rounded-full border border-${getTaskColor(selectedModelData.task)}-700/50 flex items-center`}>
                        {getTaskIcon(selectedModelData.task)} {selectedModelData.task}
                      </span>
                      
                      {selectedModelData.downloads && (
                        <span className="flex items-center text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                          <Download className="w-3 h-3 mr-1" />
                          {selectedModelData.downloads.toLocaleString()}
                        </span>
                      )}
                      
                      {selectedModelData.likes && (
                        <span className="flex items-center text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {selectedModelData.likes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Change model button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 hover:bg-gray-700/70 rounded-lg transition-all duration-300 border border-gray-600 hover:border-primary-500/50 group/btn"
                >
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
                    isDropdownOpen ? 'rotate-180 text-primary-500' : 'group-hover/btn:text-primary-500'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group relative w-full p-6 bg-gray-800/30 border-2 border-dashed border-gray-700 hover:border-primary-500/50 rounded-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-700/50 rounded-xl group-hover:bg-primary-500/10 transition-colors">
                  <Sparkles className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-gray-300 group-hover:text-white transition-colors font-medium">
                    Select a model to begin testing
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click to choose from {models.length} available models
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
                isDropdownOpen ? 'rotate-180 text-primary-500' : 'group-hover:text-primary-500'
              }`} />
            </div>
          </button>
        )}

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="mt-3 bg-gray-800/95 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate__animated animate__fadeIn">
            {/* Dropdown Header */}
            <div className="p-4 bg-gradient-to-r from-primary-900/30 to-primary-800/10 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white flex items-center">
                    <Database className="w-4 h-4 mr-2 text-primary-500" />
                    Available Models
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Select a model from the list below
                  </p>
                </div>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Models List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-700/50">
              {['sentiment', 'zero-shot', 'text-generation', 'translation', 'question-answering'].map((task) => {
                const taskModels = models.filter(m => m.task === task);
                if (taskModels.length === 0) return null;

                return (
                  <div key={task} className="p-2">
                    <div className="px-3 py-2">
                      <span className={`text-xs font-medium text-${getTaskColor(task)}-400 uppercase tracking-wider`}>
                        {task} ({taskModels.length})
                      </span>
                    </div>
                    
                    {taskModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onSelect(model.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          selectedModel === model.id 
                            ? `bg-${getTaskColor(task)}-900/30 border border-${getTaskColor(task)}-500/30` 
                            : 'hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{getTaskIcon(model.task)}</span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-white">{model.name}</p>
                                {model.isDynamic && (
                                  <span className="px-1.5 py-0.5 bg-primary-900/50 text-primary-300 text-xs rounded-full border border-primary-700">
                                    ✨
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1 font-mono">{model.id}</p>
                              
                              <div className="flex items-center space-x-3 mt-2">
                                <span className={`px-2 py-0.5 bg-${getTaskColor(task)}-900/50 text-${getTaskColor(task)}-300 text-xs rounded-full border border-${getTaskColor(task)}-700/50`}>
                                  {model.task}
                                </span>
                                
                                {model.downloads > 0 && (
                                  <span className="flex items-center text-xs text-gray-500">
                                    <Download className="w-3 h-3 mr-1" />
                                    {model.downloads.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {selectedModel === model.id && (
                            <CheckCircle className={`w-5 h-5 text-${getTaskColor(task)}-500`} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Dropdown Footer */}
            <div className="p-3 bg-gray-900/50 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {models.length} models total
                </span>
                <button
                  onClick={loadMoreModels}
                  disabled={isLoadingMore}
                  className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <Loader className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  <span>Load More</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="pt-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{showSearch ? 'Hide search' : 'Search for models'}</span>
          </button>

          {showSearch && (
            <div className="mt-3 flex space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchModels()}
                placeholder="e.g., bert, roberta, gpt..."
                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoadingMore}
              />
              <button
                onClick={searchModels}
                disabled={isLoadingMore || !searchTerm.trim()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoadingMore ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-4 gap-2 pt-4">
          <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/50">
            <p className="text-2xl font-bold text-primary-400">{models.length}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/50">
            <p className="text-2xl font-bold text-blue-400">
              {models.filter(m => m.task === 'sentiment').length}
            </p>
            <p className="text-xs text-gray-400">Sentiment</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/50">
            <p className="text-2xl font-bold text-purple-400">
              {models.filter(m => m.task === 'zero-shot').length}
            </p>
            <p className="text-xs text-gray-400">Zero-shot</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/50">
            <p className="text-2xl font-bold text-green-400">
              {models.filter(m => m.task === 'text-generation').length}
            </p>
            <p className="text-xs text-gray-400">Generation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
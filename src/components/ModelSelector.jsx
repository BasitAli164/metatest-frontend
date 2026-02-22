import React, { useState } from "react";
import { Cpu, ChevronDown, RefreshCw, Search, Loader } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const ModelSelector = ({ models, selectedModel, onSelect, onModelsUpdate }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const loadMoreModels = async () => {
    setIsLoadingMore(true);
    try {
      // Different tasks for which we want to load models
      const tasks = [
        "sentiment",
        "zero-shot-classification",
        "text-generation",
        "translation",
        "summarization",
      ];
      let allNewModels = [];

      // Fetch models for each task
      for (const task of tasks) {
        try {
          // Call the backend API to get dynamic models
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/tests/models?includeDynamic=true&task=${task}`,
          );
          const data = await response.json();

          if (data.success && data.data.length > 0) {
            // Add task information to each model
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

      // Remove duplicates based on model ID
      const existingIds = new Set(models.map((m) => m.id));
      const uniqueNewModels = allNewModels.filter(
        (m) => !existingIds.has(m.id),
      );

      if (uniqueNewModels.length > 0) {
        // Update the models list
        onModelsUpdate([...models, ...uniqueNewModels]);
        toast.success(
          `✨ Added ${uniqueNewModels.length} new models from Hugging Face!`,
        );
      } else {
        toast("No new models found - try searching instead!", { icon: "🔍" });
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
      // Direct API call to Hugging Face (bypass backend)
      const response = await fetch(
        `https://huggingface.co/api/models?search=${encodeURIComponent(searchTerm)}&limit=10`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        // Transform HF response to match our model format
        const newModels = data.map((model) => {
          // Determine task from pipeline_tag or default to 'unknown'
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

        // Remove duplicates
        const existingIds = new Set(models.map((m) => m.id));
        const uniqueNewModels = newModels.filter((m) => !existingIds.has(m.id));

        if (uniqueNewModels.length > 0) {
          onModelsUpdate([...models, ...uniqueNewModels]);
          toast.success(
            `🔍 Found ${uniqueNewModels.length} models matching "${searchTerm}"`,
          );
          setSearchTerm("");
          setShowSearch(false);
        } else {
          toast(`No new models found for "${searchTerm}"`, { icon: "ℹ️" });
        }
      } else {
        toast(`No models found for "${searchTerm}"`, { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed - please try again");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold">Select AI Model</h2>
        </div>

        {/* Model count badge */}
        <span className="text-xs bg-primary-900/50 text-primary-300 px-2 py-1 rounded-full border border-primary-800">
          {models.length} models
        </span>
      </div>

      <div className="relative">
        <select
          value={selectedModel}
          onChange={(e) => onSelect(e.target.value)}
          className="input-field appearance-none cursor-pointer pr-20"
        >
          <option value="">Choose a model for testing...</option>

          {/* Group models by task */}
          {[
            "sentiment",
            "zero-shot",
            "text-generation",
            "translation",
            "question-answering",
          ].map((task) => {
            const taskModels = models.filter((m) => m.task === task);
            if (taskModels.length === 0) return null;

            return (
              <optgroup key={task} label={`${task} (${taskModels.length})`}>
                {taskModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} {model.isDynamic ? "✨" : ""}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

        {/* Load more button */}
        <button
          onClick={loadMoreModels}
          disabled={isLoadingMore}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-primary-600 hover:bg-primary-700 rounded text-xs text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          title="Load more models from Hugging Face"
        >
          {isLoadingMore ? (
            <Loader className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          <span className="hidden sm:inline">More</span>
        </button>
      </div>

      {/* Search toggle */}
      <div className="mt-2 flex justify-end">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-xs text-primary-400 hover:text-primary-300 flex items-center space-x-1 transition-colors"
        >
          <Search className="w-3 h-3" />
          <span>{showSearch ? "Hide search" : "Search models"}</span>
        </button>
      </div>

      {/* Search input */}
      {showSearch && (
        <div className="mt-3 flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchModels()}
            placeholder="Search Hugging Face models..."
            className="input-field text-sm py-2"
            disabled={isLoadingMore}
          />
          <button
            onClick={searchModels}
            disabled={isLoadingMore || !searchTerm.trim()}
            className="px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            {isLoadingMore ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {selectedModel && (
        <div className="mt-3 p-3 bg-gradient-to-r from-primary-900/30 to-primary-900/10 border border-primary-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-primary-300 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                Active Model
              </p>
              <p className="text-sm font-medium text-white mt-1">
                {models.find((m) => m.id === selectedModel)?.name}
              </p>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                {models.find((m) => m.id === selectedModel)?.id}
              </p>
            </div>
            <span className="text-xs bg-primary-900/50 text-primary-300 px-2 py-1 rounded-full border border-primary-800">
              {models.find((m) => m.id === selectedModel)?.task}
            </span>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 bg-gray-700/30 rounded">
          <p className="text-primary-400 font-semibold">
            {models.filter((m) => m.task === "sentiment").length}
          </p>
          <p className="text-gray-500">Sentiment</p>
        </div>
        <div className="p-2 bg-gray-700/30 rounded">
          <p className="text-purple-400 font-semibold">
            {models.filter((m) => m.task === "zero-shot").length}
          </p>
          <p className="text-gray-500">Zero-shot</p>
        </div>
        <div className="p-2 bg-gray-700/30 rounded">
          <p className="text-green-400 font-semibold">
            {models.filter((m) => m.task === "text-generation").length}
          </p>
          <p className="text-gray-500">Generation</p>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;

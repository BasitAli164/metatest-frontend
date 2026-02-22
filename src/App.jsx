import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TestInput from './components/TestInput';
import ResultsChart from './components/ResultsChart';
import ModelSelector from './components/ModelSelector';
import { 
  Brain, 
  Activity, 
  Database, 
  BarChart3, 
  Shield, 
  Zap,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X
} from 'lucide-react';
import api from './services/api';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle model updates from ModelSelector (when loading more models)
  const handleModelsUpdate = (updatedModels) => {
    setModels(updatedModels);
    toast.success(`Model list updated: ${updatedModels.length} total models`);
  };

  useEffect(() => {
    fetchModels();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedModel) {
      fetchAnalytics(selectedModel);
    }
  }, [selectedModel]);

  const fetchModels = async () => {
    try {
      const response = await api.getModels();
      setModels(response.data);
    } catch (error) {
      toast.error('Failed to fetch models');
    }
  };

  const fetchAnalytics = async (modelId = '') => {
    try {
      const response = await api.getAnalytics(modelId);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    }
  };

  const handleTestSubmit = async (testData) => {
    setIsLoading(true);
    try {
      const result = await api.runTest({
        ...testData,
        modelId: selectedModel
      });
      
      toast.success(result.data.verdict, {
        icon: result.data.isViolated ? '🔴' : '✅',
        duration: 5000
      });
      
      fetchAnalytics(selectedModel);
    } catch (error) {
      toast.error('Test failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalTests = analyticsData?.overall?.reduce((acc, curr) => acc + curr.totalTests, 0) || 0;
  const totalViolations = analyticsData?.overall?.reduce((acc, curr) => acc + curr.totalViolations, 0) || 0;
  const avgReliability = analyticsData?.overall?.length > 0 
    ? Math.round(analyticsData.overall.reduce((acc, curr) => acc + curr.reliabilityScore, 0) / analyticsData.overall.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '0.75rem',
            padding: '1rem'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Header with glass morphism */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Brain className="w-8 h-8 text-primary-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold gradient-text">
                  MetaTest-MERN
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">AI Metamorphic Testing Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-gray-300">Research Grade</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Real-time Testing</span>
              </div>
              <div className="flex items-center space-x-3 ml-4">
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-xl border-t border-gray-700">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <Shield className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-gray-300">Research Grade</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Real-time Testing</span>
                </div>
                <div className="flex items-center space-x-6 pt-2">
                  <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Model Selection - Now with onModelsUpdate prop */}
        <div className="mb-8 animate__animated animate__fadeIn">
          <ModelSelector 
            models={models}
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
            onModelsUpdate={handleModelsUpdate}
          />
        </div>

        {/* Test Input and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Test Input */}
          <div className="lg:col-span-1 animate__animated animate__fadeInLeft">
            <TestInput 
              onSubmit={handleTestSubmit}
              isLoading={isLoading}
              selectedModel={selectedModel}
            />
          </div>
          
          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Tests Card */}
            <div className="stat-card group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm font-medium">Total Tests</h3>
                  <div className="p-2 bg-primary-500/10 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                    <BarChart3 className="w-5 h-5 text-primary-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{totalTests}</p>
                <p className="text-xs text-gray-500">Across all models</p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl"></div>
            </div>
            
            {/* Reliability Score Card */}
            <div className="stat-card group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm font-medium">Reliability</h3>
                  <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <Activity className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-green-400 mb-1">{avgReliability}%</p>
                <p className="text-xs text-gray-500">Average score</p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl"></div>
            </div>
            
            {/* Bugs Found Card */}
            <div className="stat-card group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm font-medium">Bugs Found</h3>
                  <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                    <Database className="w-5 h-5 text-red-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-red-400 mb-1">{totalViolations}</p>
                <p className="text-xs text-gray-500">Metamorphic violations</p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="card animate__animated animate__fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold gradient-text">Test Results by MR Type</h2>
              {analyticsData?.byMRType && (
                <span className="badge badge-primary">
                  {analyticsData.byMRType.length} MR Types
                </span>
              )}
            </div>
            {analyticsData ? (
              <ResultsChart data={analyticsData.byMRType} />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Dashboard Section */}
          <div className="card animate__animated animate__fadeInUp animate__delay-1s">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold gradient-text">Model Performance</h2>
              {analyticsData?.overall && (
                <span className="badge badge-success">
                  {analyticsData.overall.length} Models Active
                </span>
              )}
            </div>
            <Dashboard analytics={analyticsData} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 MetaTest-MERN. Research-grade AI testing platform
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                Documentation
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                API Reference
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                Research Paper
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
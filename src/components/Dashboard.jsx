import React from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const Dashboard = ({ analytics }) => {
  if (!analytics || !analytics.overall) {
    return (
      <div className="text-center text-gray-500 py-8">
        No analytics available yet. Start testing to see results.
      </div>
    );
  }

  const overallStats = analytics.overall;

  return (
    <div className="space-y-4">
      {/* Model Performance Cards */}
      {overallStats.map((stat, index) => (
        <div key={index} className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary-500" />
              <h3 className="font-medium text-sm">{stat.model_id.split('/').pop()}</h3>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              stat.reliabilityScore >= 80 ? 'bg-green-900 text-green-300' :
              stat.reliabilityScore >= 60 ? 'bg-yellow-900 text-yellow-300' :
              'bg-red-900 text-red-300'
            }`}>
              Reliability: {Math.round(stat.reliabilityScore)}%
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <p className="text-xs text-gray-400">Tests</p>
              <p className="text-lg font-semibold text-blue-400">{stat.totalTests}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Violations</p>
              <p className="text-lg font-semibold text-red-400">{stat.totalViolations}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">MR Types</p>
              <p className="text-lg font-semibold text-green-400">{stat.uniqueMRs}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-400">Passed</span>
              <span className="text-red-400">Failed</span>
            </div>
            <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 float-left"
                style={{ width: `${stat.reliabilityScore}%` }}
              />
              <div 
                className="h-full bg-red-500 float-left"
                style={{ width: `${100 - stat.reliabilityScore}%` }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Quick Insights */}
      {analytics.trends && analytics.trends.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            <h3 className="text-sm font-medium">Recent Trends</h3>
          </div>
          
          <div className="space-y-2">
            {analytics.trends.slice(-3).map((trend, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-gray-400">{trend._id.date}</span>
                <span className="text-green-400">✓ {trend.dailyTests - trend.dailyViolations}</span>
                <span className="text-red-400">✗ {trend.dailyViolations}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className={`mt-4 p-3 rounded-lg ${
        overallStats.length > 0 && overallStats.some(s => s.reliabilityScore < 70)
          ? 'bg-red-900/20 border border-red-800'
          : 'bg-green-900/20 border border-green-800'
      }`}>
        <div className="flex items-start space-x-2">
          {overallStats.length > 0 && overallStats.some(s => s.reliabilityScore < 70) ? (
            <>
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <p className="text-xs text-red-200">
                Some models show low reliability. Consider reviewing metamorphic violations for fairness and consistency issues.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <p className="text-xs text-green-200">
                Models are performing well with high metamorphic consistency. Continue monitoring for edge cases.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
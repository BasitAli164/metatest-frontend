import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

const ResultsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available. Run some tests to see results.
      </div>
    );
  }

  // Prepare data for bar chart
  const chartData = data.map(item => ({
    name: item.MR_type,
    passRate: Math.round(item.passRate),
    violations: item.violations,
    total: item.totalTests
  }));

  // Prepare data for pie chart
  const pieData = data.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.model_id);
    if (existing) {
      existing.value += item.violations;
    } else {
      acc.push({ name: item.model_id, value: item.violations });
    }
    return acc;
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-gray-300">{`${label}`}</p>
          <p className="text-green-400">{`Pass Rate: ${payload[0].value}%`}</p>
          <p className="text-red-400">{`Violations: ${payload[0].payload.violations}`}</p>
          <p className="text-gray-400">{`Total Tests: ${payload[0].payload.total}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="passRate" fill="#10b981" name="Pass Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Violations Distribution */}
      {pieData.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Violations by Model</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split('/').pop()}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsChart;
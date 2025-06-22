import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';

const Finance = () => {
  const [financeData, setFinanceData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const periods = [
    { value: 'current_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_year', label: 'Last Year' }
  ];

  useEffect(() => {
    if (user?.email) {
      fetchFinanceData();
      fetchSummary();
    }
  }, [user, selectedPeriod]);
 
  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/finance/data?period=${selectedPeriod}`,
        { withCredentials: true }
      );
      setFinanceData(response.data.data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      toast.error('Failed to load finance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const summaryResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/finance/summary`,
        { withCredentials: true }
      );
      setSummary(summaryResponse.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPeriodLabel = (period) => {
    return periods.find(p => p.value === period)?.label || period;
  };

  // Check if user has access to finance features
  const hasFinanceAccess = user?.role === 'admin';

  if (!hasFinanceAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access finance features.</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden relative z-10">
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-8 relative">
          {/* Header Row with Back, Heading, Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">

            {/* Back Button */}
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-1 text-gray-700 hover:text-black font-medium text-sm px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition cursor-pointer z-30 relative"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Centered Heading */}
            <div className="text-center w-full sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 z-10 pointer-events-none">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 font-montserrat">Finance Dashboard</h1>
              <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Track your gym's revenue and subscription analytics</p>
            </div>

            {/* Time Filter */}
            <div className="flex flex-col gap-1 items-end w-full sm:w-auto z-30 relative">
              <label className="text-xs font-medium text-gray-700">Time Period:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 sm:w-auto min-w-0 cursor-pointer"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value} className="text-sm">
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


        {/* Summary Cards */}
        {financeData && (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600 truncate">
                    {formatCurrency(financeData.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0 ml-2" />
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Subscriptions</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600 truncate">
                    {financeData.summary.totalRecords}
                  </p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0 ml-2" />
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Average Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600 truncate">
                    {formatCurrency(financeData.summary.averageRevenue)}
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0 ml-2" />
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Top Plan</p>
                  <p className="text-sm sm:text-lg font-bold text-orange-600 truncate">
                    {financeData.highestRevenuePlan?.plan || 'N/A'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {formatCurrency(financeData.highestRevenuePlan?.revenue || 0)}
                  </p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 flex-shrink-0 ml-2" />
              </div>
            </div>
          </div>
        )}

        {/* Chart Section */}
        {financeData && financeData.chartData.length > 0 && (
          <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md border border-gray-200 mb-4 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Revenue by Plan - {getPeriodLabel(selectedPeriod)}
            </h2>
            <div className="h-48 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="plan"
                    tick={{ fontSize: 10, sm: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fontSize: 10, sm: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    labelFormatter={(label) => `Plan: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Table Section */}
        {financeData && financeData.tableData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Transaction Details - {getPeriodLabel(selectedPeriod)}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financeData.tableData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 text-start">
                        {record.memberName}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-start">
                        {record.memberRollNo}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-start">
                        {record.plan}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600 text-start">
                        {formatCurrency(record.amount)}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-start">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-500 max-w-xs truncate text-start">
                        {record.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data State */}
        {financeData && financeData.tableData.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <DollarSign className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-sm sm:text-base text-gray-500">
              No revenue data available for {getPeriodLabel(selectedPeriod)}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { contractsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorState from '../components/UI/ErrorState';

const Insights = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractsAPI.getContracts(1, 100);
      setContracts(response.contracts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskStats = () => {
    const stats = contracts.reduce((acc, contract) => {
      acc[contract.risk] = (acc[contract.risk] || 0) + 1;
      return acc;
    }, {});
    
    return {
      high: stats.High || 0,
      medium: stats.Medium || 0,
      low: stats.Low || 0,
      total: contracts.length
    };
  };

  const getStatusStats = () => {
    const stats = contracts.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1;
      return acc;
    }, {});
    
    return {
      active: stats.Active || 0,
      expired: stats.Expired || 0,
      renewalDue: stats['Renewal Due'] || 0,
      total: contracts.length
    };
  };

  const getExpiringSoon = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return contracts.filter(contract => {
      const expiryDate = new Date(contract.expiry);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
    });
  };

  const getRiskTrend = () => {
    // Mock trend data - in real app, this would come from historical data
    return {
      high: { change: 12, trend: 'up' },
      medium: { change: -5, trend: 'down' },
      low: { change: 8, trend: 'up' }
    };
  };

  const riskStats = getRiskStats();
  const statusStats = getStatusStats();
  const expiringSoon = getExpiringSoon();
  const riskTrend = getRiskTrend();

  if (loading) return <LoadingSpinner message="Loading insights..." />;
  if (error) return <ErrorState message={error} onRetry={fetchContracts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Contract Insights</h1>
          <p className="text-secondary-600 mt-1">AI-powered analysis and risk assessment</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Total Contracts</p>
              <p className="text-2xl font-bold text-secondary-900">{riskStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">High Risk</p>
              <p className="text-2xl font-bold text-danger-600">{riskStats.high}</p>
              <div className="flex items-center space-x-1 mt-1">
                {riskTrend.high.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-danger-500" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-success-500" />
                )}
                <span className="text-xs text-secondary-500">
                  {riskTrend.high.change}% vs last period
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-warning-600">{expiringSoon.length}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Active Contracts</p>
              <p className="text-2xl font-bold text-success-600">{statusStats.active}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Distribution */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Risk Distribution</h3>
          <div className="space-y-4">
            {[
              { level: 'High', count: riskStats.high, color: 'danger', percentage: Math.round((riskStats.high / riskStats.total) * 100) },
              { level: 'Medium', count: riskStats.medium, color: 'warning', percentage: Math.round((riskStats.medium / riskStats.total) * 100) },
              { level: 'Low', count: riskStats.low, color: 'success', percentage: Math.round((riskStats.low / riskStats.total) * 100) }
            ].map((item) => (
              <div key={item.level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700">{item.level} Risk</span>
                  <span className="text-sm text-secondary-600">{item.count} contracts ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${item.color}-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Status Overview</h3>
          <div className="space-y-4">
            {[
              { status: 'Active', count: statusStats.active, color: 'success', icon: CheckCircleIcon },
              { status: 'Renewal Due', count: statusStats.renewalDue, color: 'warning', icon: ClockIcon },
              { status: 'Expired', count: statusStats.expired, color: 'danger', icon: ExclamationTriangleIcon }
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                  <span className="text-sm font-medium text-secondary-700">{item.status}</span>
                </div>
                <span className="text-lg font-bold text-secondary-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Expiring Contracts */}
      {expiringSoon.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Contracts Expiring Soon</h3>
          <div className="space-y-3">
            {expiringSoon.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-warning-50 rounded-lg border border-warning-200"
              >
                <div>
                  <p className="font-medium text-secondary-900">{contract.name}</p>
                  <p className="text-sm text-secondary-600">{contract.parties}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-warning-700">
                    {new Date(contract.expiry).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {Math.ceil((new Date(contract.expiry) - new Date()) / (1000 * 60 * 60 * 24))} days left
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          {[
            {
              title: "Review High-Risk Contracts",
              description: `${riskStats.high} contracts require immediate attention due to high risk factors.`,
              priority: "High",
              action: "Review Now"
            },
            {
              title: "Renewal Planning",
              description: `${expiringSoon.length} contracts are expiring within 30 days. Plan renewals or terminations.`,
              priority: "Medium",
              action: "Plan Renewals"
            },
            {
              title: "Risk Assessment Update",
              description: "Consider updating risk assessment criteria based on recent contract performance.",
              priority: "Low",
              action: "Update Criteria"
            }
          ].map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-lg"
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${
                recommendation.priority === 'High' ? 'bg-danger-500' :
                recommendation.priority === 'Medium' ? 'bg-warning-500' : 'bg-success-500'
              }`} />
              <div className="flex-1">
                <h4 className="font-medium text-secondary-900">{recommendation.title}</h4>
                <p className="text-sm text-secondary-600 mt-1">{recommendation.description}</p>
              </div>
              <button className="btn-primary text-sm">
                {recommendation.action}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;

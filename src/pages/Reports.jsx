import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentChartBarIcon, 
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { contractsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorState from '../components/UI/ErrorState';

const Reports = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

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

  const generateReport = () => {
    // Mock report generation
    console.log('Generating report...');
  };

  const downloadReport = (format) => {
    // Mock download
    console.log(`Downloading report as ${format}...`);
  };

  const getReportData = () => {
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === 'Active').length;
    const expiredContracts = contracts.filter(c => c.status === 'Expired').length;
    const renewalDue = contracts.filter(c => c.status === 'Renewal Due').length;
    
    const highRisk = contracts.filter(c => c.risk === 'High').length;
    const mediumRisk = contracts.filter(c => c.risk === 'Medium').length;
    const lowRisk = contracts.filter(c => c.risk === 'Low').length;

    return {
      totalContracts,
      activeContracts,
      expiredContracts,
      renewalDue,
      highRisk,
      mediumRisk,
      lowRisk
    };
  };

  const reportData = getReportData();

  if (loading) return <LoadingSpinner message="Loading reports..." />;
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
          <h1 className="text-2xl font-bold text-secondary-900">Contract Reports</h1>
          <p className="text-secondary-600 mt-1">Generate and download comprehensive contract analytics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={generateReport}
            className="btn-primary flex items-center space-x-2"
          >
            <DocumentChartBarIcon className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </motion.div>

      {/* Report Types */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          {
            id: 'overview',
            title: 'Overview Report',
            description: 'High-level contract portfolio summary',
            icon: ChartBarIcon,
            color: 'primary'
          },
          {
            id: 'risk',
            title: 'Risk Analysis',
            description: 'Detailed risk assessment and recommendations',
            icon: ExclamationTriangleIcon,
            color: 'danger'
          },
          {
            id: 'renewal',
            title: 'Renewal Report',
            description: 'Contracts due for renewal or termination',
            icon: ClockIcon,
            color: 'warning'
          },
          {
            id: 'compliance',
            title: 'Compliance Report',
            description: 'Regulatory compliance and audit trail',
            icon: CheckCircleIcon,
            color: 'success'
          },
          {
            id: 'financial',
            title: 'Financial Impact',
            description: 'Cost analysis and budget implications',
            icon: DocumentTextIcon,
            color: 'secondary'
          },
          {
            id: 'custom',
            title: 'Custom Report',
            description: 'Build your own report with specific criteria',
            icon: DocumentChartBarIcon,
            color: 'primary'
          }
        ].map((report) => (
          <motion.div
            key={report.id}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`card cursor-pointer transition-all duration-300 ${
              selectedReport === report.id
                ? `border-${report.color}-500 bg-${report.color}-50`
                : 'hover:shadow-medium'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center`}>
                <report.icon className={`w-6 h-6 text-${report.color}-600`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-secondary-900">{report.title}</h3>
                <p className="text-sm text-secondary-600 mt-1">{report.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Preview */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">
            {selectedReport === 'overview' && 'Overview Report Preview'}
            {selectedReport === 'risk' && 'Risk Analysis Preview'}
            {selectedReport === 'renewal' && 'Renewal Report Preview'}
            {selectedReport === 'compliance' && 'Compliance Report Preview'}
            {selectedReport === 'financial' && 'Financial Impact Preview'}
            {selectedReport === 'custom' && 'Custom Report Preview'}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => downloadReport('PDF')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => downloadReport('Excel')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => downloadReport('CSV')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <p className="text-2xl font-bold text-secondary-900">{reportData.totalContracts}</p>
              <p className="text-sm text-secondary-600">Total Contracts</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <p className="text-2xl font-bold text-success-600">{reportData.activeContracts}</p>
              <p className="text-sm text-secondary-600">Active</p>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <p className="text-2xl font-bold text-warning-600">{reportData.renewalDue}</p>
              <p className="text-sm text-secondary-600">Renewal Due</p>
            </div>
            <div className="text-center p-4 bg-danger-50 rounded-lg">
              <p className="text-2xl font-bold text-danger-600">{reportData.highRisk}</p>
              <p className="text-sm text-secondary-600">High Risk</p>
            </div>
          </div>

          {/* Risk Distribution Chart */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary-900">Risk Distribution</h4>
            <div className="space-y-3">
              {[
                { level: 'High', count: reportData.highRisk, color: 'danger' },
                { level: 'Medium', count: reportData.mediumRisk, color: 'warning' },
                { level: 'Low', count: reportData.lowRisk, color: 'success' }
              ].map((item) => {
                const percentage = reportData.totalContracts > 0 
                  ? Math.round((item.count / reportData.totalContracts) * 100) 
                  : 0;
                
                return (
                  <div key={item.level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-700">{item.level} Risk</span>
                      <span className="text-sm text-secondary-600">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-${item.color}-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contract List Preview */}
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary-900">Contract Summary</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Contract Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Parties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Expiry
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {contracts.slice(0, 5).map((contract) => (
                    <tr key={contract.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                        {contract.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                        {contract.parties}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contract.status === 'Active' ? 'bg-success-100 text-success-800' :
                          contract.status === 'Expired' ? 'bg-danger-100 text-danger-800' :
                          'bg-warning-100 text-warning-800'
                        }`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contract.risk === 'High' ? 'bg-danger-100 text-danger-800' :
                          contract.risk === 'Medium' ? 'bg-warning-100 text-warning-800' :
                          'bg-success-100 text-success-800'
                        }`}>
                          {contract.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                        {new Date(contract.expiry).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;

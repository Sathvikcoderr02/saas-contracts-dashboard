import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  BellIcon,
  PlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { contractsAPI } from '../services/api';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EmptyState from '../components/UI/EmptyState';
import ErrorState from '../components/UI/ErrorState';

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUploadModalOpen } = useApp();
  const { user, logout } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchContracts = async (page = 1, searchTerm = '', status = '', risk = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractsAPI.getContracts(page, 10, searchTerm, status, risk);
      setContracts(response.contracts);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchContracts(1, value, statusFilter, riskFilter);
  };

  const handleStatusFilter = (status) => {
    const newStatus = statusFilter === status ? '' : status;
    setStatusFilter(newStatus);
    fetchContracts(1, search, newStatus, riskFilter);
  };

  const handleRiskFilter = (risk) => {
    const newRisk = riskFilter === risk ? '' : risk;
    setRiskFilter(newRisk);
    fetchContracts(1, search, statusFilter, newRisk);
  };

  const handlePageChange = (page) => {
    fetchContracts(page, search, statusFilter, riskFilter);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="w-5 h-5 text-success-500" />;
      case 'Expired':
        return <ExclamationTriangleIcon className="w-5 h-5 text-danger-500" />;
      case 'Renewal Due':
        return <ClockIcon className="w-5 h-5 text-warning-500" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-secondary-500" />;
    }
  };

  const getRiskBadge = (risk) => {
    const styles = {
      Low: 'bg-success-100 text-success-800',
      Medium: 'bg-warning-100 text-warning-800',
      High: 'bg-danger-100 text-danger-800'
    };
    return styles[risk] || 'bg-secondary-100 text-secondary-800';
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'High':
        return <ExclamationTriangleIcon className="w-4 h-4 text-danger-500" />;
      case 'Medium':
        return <ClockIcon className="w-4 h-4 text-warning-500" />;
      case 'Low':
        return <CheckCircleIcon className="w-4 h-4 text-success-500" />;
      default:
        return <ShieldCheckIcon className="w-4 h-4 text-secondary-500" />;
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={() => fetchContracts()} />;

  return (
    <div className="min-h-screen">
      {/* Header with Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg border-b border-secondary-200 p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Left side - Title and stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Contracts Dashboard</h1>
              <p className="text-secondary-600 mt-1 text-sm">Manage and monitor your contract portfolio with AI-powered insights</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <div className="glass-effect rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full pulse-glow"></div>
                  <span className="text-sm font-medium text-secondary-700">
                    {pagination.total} contracts found
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Quick Actions */}
          <div className="flex items-center space-x-4">
            {/* Upload button */}
            <button
              onClick={() => setUploadModalOpen(true)}
              className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 py-2 px-3 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Contract</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-secondary-100 transition-colors group">
              <BellIcon className="w-5 h-5 text-secondary-600 group-hover:text-primary-600 transition-colors" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full animate-pulse"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-secondary-50 hover:to-secondary-100 transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                  <p className="text-xs text-primary-600 font-medium">Administrator</p>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-secondary-500 group-hover:text-primary-600 transition-colors" />
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                  >
                    Profile Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                  >
                    Account Preferences
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                  >
                    Help & Support
                  </a>
                  <hr className="my-1 border-secondary-200" />
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white shadow-lg border-b border-secondary-200 p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                placeholder="Search contracts by name or parties..."
                value={search}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-lg text-sm placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4 text-secondary-500" />
              <span className="text-sm font-medium text-secondary-700">Status:</span>
              <div className="flex space-x-1">
                {['Active', 'Expired', 'Renewal Due'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      statusFilter === status
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-secondary-700">Risk:</span>
              <div className="flex space-x-1">
                {['Low', 'Medium', 'High'].map((risk) => (
                  <button
                    key={risk}
                    onClick={() => handleRiskFilter(risk)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      riskFilter === risk
                        ? getRiskBadge(risk)
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contracts Table */}
      {contracts.length === 0 ? (
        <EmptyState
          icon={DocumentTextIcon}
          title="No contracts found"
          description="Try adjusting your search or filter criteria"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-lg border border-secondary-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-gradient-to-r from-secondary-50 to-secondary-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Contract Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Parties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {contracts.map((contract, index) => (
                  <motion.tr
                    key={contract.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-secondary-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                          <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-secondary-900">{contract.name}</div>
                          <div className="text-sm text-secondary-500">ID: {contract.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">{contract.parties}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        {new Date(contract.expiry).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-secondary-500">
                        {getDaysUntilExpiry(contract.expiry) > 0 
                          ? `${getDaysUntilExpiry(contract.expiry)} days left`
                          : 'Expired'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.status === 'Active' 
                          ? 'bg-success-100 text-success-800' 
                          : contract.status === 'Expired'
                          ? 'bg-danger-100 text-danger-800'
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {getStatusIcon(contract.status)}
                        <span className="ml-1">{contract.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadge(contract.risk)}`}>
                          {getRiskIcon(contract.risk)}
                          <span className="ml-1">{contract.risk}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/contracts/${contract.id}`)}
                        className="text-primary-600 hover:text-primary-900 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between bg-white rounded-xl shadow-soft border border-secondary-200 p-4"
        >
          <div className="text-sm text-secondary-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-secondary-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;

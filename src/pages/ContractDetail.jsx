import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { contractsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorState from '../components/UI/ErrorState';
import { useApp } from '../contexts/AppContext';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setEvidenceDrawerOpen, setEvidenceData } = useApp();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('clauses');

  useEffect(() => {
    fetchContractDetails();
  }, [id]);

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractsAPI.getContractById(id);
      setContract(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="w-6 h-6 text-success-500" />;
      case 'Expired':
        return <ExclamationTriangleIcon className="w-6 h-6 text-danger-500" />;
      case 'Renewal Due':
        return <ClockIcon className="w-6 h-6 text-warning-500" />;
      default:
        return <DocumentTextIcon className="w-6 h-6 text-secondary-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-success-700 bg-success-50 border-success-200';
      case 'Expired':
        return 'text-danger-700 bg-danger-50 border-danger-200';
      case 'Renewal Due':
        return 'text-warning-700 bg-warning-50 border-warning-200';
      default:
        return 'text-secondary-700 bg-secondary-50 border-secondary-200';
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
        return <ExclamationTriangleIcon className="w-5 h-5 text-danger-500" />;
      case 'Medium':
        return <ClockIcon className="w-5 h-5 text-warning-500" />;
      case 'Low':
        return <CheckCircleIcon className="w-5 h-5 text-success-500" />;
      default:
        return <ShieldCheckIcon className="w-5 h-5 text-secondary-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewEvidence = (evidence) => {
    setEvidenceData(evidence);
    setEvidenceDrawerOpen(true);
  };

  if (loading) return <LoadingSpinner message="Loading contract details..." />;
  if (error) return <ErrorState message={error} onRetry={fetchContractDetails} />;
  if (!contract) return <ErrorState message="Contract not found" onRetry={() => navigate('/dashboard')} />;

  const daysUntilExpiry = getDaysUntilExpiry(contract.expiry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-secondary-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{contract.name}</h1>
            <p className="text-secondary-600">{contract.parties}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(contract.status)}`}>
            {getStatusIcon(contract.status)}
            <span className="ml-2">{contract.status}</span>
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskBadge(contract.risk)}`}>
            {getRiskIcon(contract.risk)}
            <span className="ml-2">{contract.risk} Risk</span>
          </span>
        </div>
      </motion.div>

      {/* Contract Metadata */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-600">Start Date</p>
              <p className="font-semibold text-secondary-900">{formatDate(contract.start)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-600">Expiry Date</p>
              <p className="font-semibold text-secondary-900">{formatDate(contract.expiry)}</p>
              {daysUntilExpiry > 0 && (
                <p className="text-xs text-secondary-500">{daysUntilExpiry} days remaining</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-600">Contract ID</p>
              <p className="font-semibold text-secondary-900">{contract.id}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-b border-secondary-200"
      >
        <nav className="flex space-x-8">
          {[
            { id: 'clauses', name: 'Clauses', icon: DocumentTextIcon },
            { id: 'insights', name: 'AI Insights', icon: LightBulbIcon },
            { id: 'evidence', name: 'Evidence', icon: DocumentMagnifyingGlassIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'clauses' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Contract Clauses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contract.clauses?.map((clause, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:shadow-medium transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-secondary-900">{clause.title}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-sm font-medium text-success-700">
                        {Math.round(clause.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary-600 text-sm">{clause.summary}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">AI Risk Analysis</h3>
            <div className="space-y-3">
              {contract.insights?.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.risk === 'High'
                      ? 'bg-danger-50 border-danger-500'
                      : insight.risk === 'Medium'
                      ? 'bg-warning-50 border-warning-500'
                      : 'bg-success-50 border-success-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getRiskIcon(insight.risk)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm font-medium ${
                          insight.risk === 'High'
                            ? 'text-danger-700'
                            : insight.risk === 'Medium'
                            ? 'text-warning-700'
                            : 'text-success-700'
                        }`}>
                          {insight.risk} Risk
                        </span>
                      </div>
                      <p className="text-secondary-700">{insight.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Evidence & References</h3>
            <div className="space-y-3">
              {contract.evidence?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:shadow-medium transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewEvidence(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-primary-600">{item.source}</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-xs text-primary-700">
                            {Math.round(item.relevance * 100)}% relevance
                          </span>
                        </div>
                      </div>
                      <p className="text-secondary-700 text-sm italic">"{item.snippet}"</p>
                    </div>
                    <button className="ml-4 p-2 rounded-lg hover:bg-secondary-100 transition-colors">
                      <EyeIcon className="w-4 h-4 text-secondary-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContractDetail;

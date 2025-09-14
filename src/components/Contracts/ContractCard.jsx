import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ContractCard = ({ contract }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const daysUntilExpiry = getDaysUntilExpiry(contract.expiry);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card-hover group cursor-pointer"
    >
      <Link to={`/contracts/${contract.id}`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors truncate">
                {contract.name}
              </h3>
              <p className="text-sm text-secondary-600 mt-1 truncate">
                {contract.parties}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {getStatusIcon(contract.status)}
            </div>
          </div>

          {/* Status and Risk */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
              {contract.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadge(contract.risk)}`}>
              {contract.risk} Risk
            </span>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-600">Expires</span>
              <span className="font-medium text-secondary-900">
                {formatDate(contract.expiry)}
              </span>
            </div>
            
            {/* Days until expiry indicator */}
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  daysUntilExpiry < 30 ? 'bg-danger-500' :
                  daysUntilExpiry < 90 ? 'bg-warning-500' :
                  'bg-success-500'
                }`}
                style={{ 
                  width: `${Math.min(100, Math.max(0, (daysUntilExpiry / 365) * 100))}%` 
                }}
              />
            </div>
            
            {daysUntilExpiry > 0 && (
              <p className="text-xs text-secondary-500">
                {daysUntilExpiry} days remaining
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
            <span className="text-xs text-secondary-500">
              Contract ID: {contract.id}
            </span>
            <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
              <span className="text-sm font-medium mr-1">View Details</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ContractCard;

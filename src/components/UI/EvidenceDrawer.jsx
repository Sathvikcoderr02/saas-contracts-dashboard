import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, DocumentMagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../contexts/AppContext';

const EvidenceDrawer = () => {
  const { evidenceDrawerOpen, setEvidenceDrawerOpen, evidenceData } = useApp();

  if (!evidenceDrawerOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setEvidenceDrawerOpen(false)}
        />
        
        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <DocumentMagnifyingGlassIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-secondary-900">Evidence Details</h2>
                  <p className="text-sm text-secondary-600">Contract reference and snippet</p>
                </div>
              </div>
              <button
                onClick={() => setEvidenceDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-secondary-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {evidenceData && (
                <div className="space-y-6">
                  {/* Source Information */}
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-secondary-900 mb-2">Source Reference</h3>
                    <p className="text-lg font-semibold text-primary-600">{evidenceData.source}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-sm text-primary-700">
                        {Math.round(evidenceData.relevance * 100)}% relevance
                      </span>
                    </div>
                  </div>

                  {/* Snippet */}
                  <div>
                    <h3 className="text-sm font-medium text-secondary-900 mb-3">Contract Snippet</h3>
                    <div className="bg-secondary-50 rounded-lg p-4 border-l-4 border-primary-500">
                      <p className="text-secondary-700 italic leading-relaxed">
                        "{evidenceData.snippet}"
                      </p>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h3 className="text-sm font-medium text-secondary-900 mb-3">AI Analysis</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-success-50 rounded-lg border border-success-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                          <span className="text-sm font-medium text-success-700">Confidence Score</span>
                        </div>
                        <p className="text-sm text-success-600">
                          High confidence match based on keyword analysis and context
                        </p>
                      </div>
                      
                      <div className="p-3 bg-warning-50 rounded-lg border border-warning-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                          <span className="text-sm font-medium text-warning-700">Context</span>
                        </div>
                        <p className="text-sm text-warning-600">
                          This clause appears in the liability section and may require legal review
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-secondary-900">Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full btn-primary flex items-center justify-center space-x-2">
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        <span>View Full Contract</span>
                      </button>
                      <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                        <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                        <span>Find Similar Clauses</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-secondary-200">
              <button
                onClick={() => setEvidenceDrawerOpen(false)}
                className="w-full btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EvidenceDrawer;

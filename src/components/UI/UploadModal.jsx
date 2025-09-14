import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  CloudArrowUpIcon, 
  DocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../../contexts/AppContext';
import { uploadAPI } from '../../services/api';

const UploadModal = () => {
  const { uploadModalOpen, setUploadModalOpen } = useApp();
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (fileList) => {
    const newFiles = fileList.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload for each file
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id);
    });
  };

  const simulateUpload = async (fileId) => {
    const updateFileStatus = (status, progress = 0) => {
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, status, progress }
          : file
      ));
    };

    try {
      updateFileStatus('uploading', 0);
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateFileStatus('uploading', i);
      }
      
      // Simulate API call
      await uploadAPI.uploadFile(files.find(f => f.id === fileId)?.file);
      updateFileStatus('success', 100);
    } catch (error) {
      updateFileStatus('error', 0);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📄';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-success-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-danger-500" />;
      case 'uploading':
        return <ArrowPathIcon className="w-5 h-5 text-primary-500 animate-spin" />;
      default:
        return <DocumentIcon className="w-5 h-5 text-secondary-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success-700 bg-success-50 border-success-200';
      case 'error':
        return 'text-danger-700 bg-danger-50 border-danger-200';
      case 'uploading':
        return 'text-primary-700 bg-primary-50 border-primary-200';
      default:
        return 'text-secondary-700 bg-secondary-50 border-secondary-200';
    }
  };

  if (!uploadModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <CloudArrowUpIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">Upload Contracts</h2>
                  <p className="text-sm text-secondary-600">Upload contract files for AI analysis</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-secondary-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-secondary-300 hover:border-primary-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <CloudArrowUpIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-secondary-600 mb-4">
                  Supports PDF, DOC, DOCX files up to 10MB
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="btn-primary">
                  Choose Files
                </button>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-secondary-900">
                    Upload Queue ({files.length})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <span className="text-2xl">{getFileIcon(file.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {/* Progress Bar */}
                          {file.status === 'uploading' && (
                            <div className="w-20 h-2 bg-secondary-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-500 transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                          
                          {/* Status */}
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(file.status)}`}>
                            {getStatusIcon(file.status)}
                            <span className="capitalize">{file.status}</span>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1 rounded hover:bg-secondary-200 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4 text-secondary-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-secondary-200">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="btn-primary"
                disabled={files.length === 0 || files.some(f => f.status === 'uploading')}
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;

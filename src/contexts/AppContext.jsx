import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_UPLOAD_MODAL_OPEN':
      return { ...state, uploadModalOpen: action.payload };
    case 'SET_EVIDENCE_DRAWER_OPEN':
      return { ...state, evidenceDrawerOpen: action.payload };
    case 'SET_EVIDENCE_DATA':
      return { ...state, evidenceData: action.payload };
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  error: null,
  sidebarOpen: true,
  uploadModalOpen: false,
  evidenceDrawerOpen: false,
  evidenceData: null
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setSidebarOpen = (open) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setUploadModalOpen = (open) => {
    dispatch({ type: 'SET_UPLOAD_MODAL_OPEN', payload: open });
  };

  const setEvidenceDrawerOpen = (open) => {
    dispatch({ type: 'SET_EVIDENCE_DRAWER_OPEN', payload: open });
  };

  const setEvidenceData = (data) => {
    dispatch({ type: 'SET_EVIDENCE_DATA', payload: data });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setSidebarOpen,
    toggleSidebar,
    setUploadModalOpen,
    setEvidenceDrawerOpen,
    setEvidenceData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import React, { useState } from 'react';
import { 
  Bars3Icon, 
  BellIcon, 
  PlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const Topbar = () => {
  const { sidebarOpen, toggleSidebar, setUploadModalOpen } = useApp();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b border-secondary-200 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors lg:hidden"
          >
            <Bars3Icon className="w-5 h-5 text-secondary-600" />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Upload button */}
          <button
            onClick={() => setUploadModalOpen(true)}
            className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
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
    </header>
  );
};

export default Topbar;

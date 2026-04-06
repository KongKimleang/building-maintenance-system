import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { getNotifications } from '../services/api';

function Navbar({ userInfo = {}, navLinks = [] }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch unread notification count
  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await getNotifications();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to={userInfo.dashboardLink || '/dashboard'}
              className="flex items-center space-x-3"
            >
              <span className="text-3xl">🏢</span>
              <div>
                <h1 className="text-xl font-bold text-white">BuildingMMS</h1>
                <p className="text-xs text-blue-100">Maintenance Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          {navLinks && navLinks.length > 0 && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    link.active
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side - Notifications and User */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-blue-100 hover:text-white transition"
              >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => {
                  setShowNotifications(false);
                  fetchUnreadCount(); // Refresh count when closing
                }}
                userRole={user.role}
              />
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 text-white hover:bg-blue-600 px-3 py-2 rounded-md transition"
              >
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {userInfo.name || 'User'}
                  </p>
                  <p className="text-xs text-blue-100">
                    {userInfo.subtitle || ''}
                  </p>
                </div>
                <span className="text-2xl">👤</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {navLinks && navLinks.length > 0 && (
        <div className="md:hidden border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  link.active
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

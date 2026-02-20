import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ userInfo, notificationCount = 0 }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Later we'll add proper logout logic with backend
    // For now, just redirect to login
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation Links */}
          <div className="flex items-center">
            <Link to={userInfo.dashboardLink} className="text-2xl font-bold text-primary">
              🏢 BuildingMMS
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-8">
              {userInfo.navLinks && userInfo.navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`${
                    link.active
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-primary'
                  } px-3 py-2 font-medium transition`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side - Notifications and User Info */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-primary transition">
              <span className="text-xl">🔔</span>
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {/* User Info */}
            <div className="flex items-center space-x-2">
              {userInfo.name && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{userInfo.name}</p>
                  {userInfo.subtitle && (
                    <p className="text-xs text-gray-500">{userInfo.subtitle}</p>
                  )}
                </div>
              )}
              <button className="p-2 text-gray-600 hover:text-primary transition">
                <span className="text-xl">👤</span>
              </button>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-danger font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
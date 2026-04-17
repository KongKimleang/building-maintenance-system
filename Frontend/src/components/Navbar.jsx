import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { getNotifications } from '../services/api';
import { useTheme } from '../context/ThemeContext';

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" fill="#ffffff" />
      <rect x="7" y="6" width="2" height="2" fill="#1d4ed8" />
      <rect x="11" y="6" width="2" height="2" fill="#1d4ed8" />
      <rect x="15" y="6" width="2" height="2" fill="#1d4ed8" />
      <rect x="7" y="10" width="2" height="2" fill="#1d4ed8" />
      <rect x="11" y="10" width="2" height="2" fill="#1d4ed8" />
      <rect x="15" y="10" width="2" height="2" fill="#1d4ed8" />
      <rect x="10" y="15" width="4" height="6" fill="#1d4ed8" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 1 1 12 0v4.5l1.6 2.4a1 1 0 0 1-.83 1.55H5.23a1 1 0 0 1-.83-1.55L6 13.5V9z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 20c.5-3.4 2.9-5.2 7-5.2 4.1 0 6.5 1.8 7 5.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M14.7 3.4a8.6 8.6 0 1 0 5.9 12.6A7.6 7.6 0 0 1 14.7 3.4z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function NavGlyph({ label }) {
  if (label.toLowerCase().includes('dashboard')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (label.toLowerCase().includes('request')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (label.toLowerCase().includes('task')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path d="M6 7h12M6 12h12M6 17h7" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="5" cy="7" r="1" fill="currentColor" />
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="5" cy="17" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (label.toLowerCase().includes('user')) {
    return <UserIcon />;
  }

  if (label.toLowerCase().includes('history')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path d="M4 12a8 8 0 1 0 2.2-5.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 4v4h4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function Navbar({ userInfo = {}, navLinks = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(() => {
    return localStorage.getItem('sidebarHidden') === 'true';
  });
  const userMenuRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Support legacy usage where nav links are passed inside userInfo.
  const providedLinks =
    navLinks.length > 0 ? navLinks : (userInfo.navLinks || []);

  const normalizeRole = (value) => {
    const raw = String(value || '')
      .trim()
      .toLowerCase();

    if (!raw) return null;
    if (raw === 'admin' || raw === 'administrator') return 'admin';
    if (raw === 'technician' || raw === 'tech') return 'technician';
    if (raw === 'staff') return 'staff';
    if (raw === 'resident') return 'resident';
    return null;
  };

  const roleFromPath =
    location.pathname.startsWith('/admin')
      ? 'admin'
      : location.pathname.startsWith('/technician')
        ? 'technician'
        : location.pathname.startsWith('/resident')
          ? 'resident'
          : null;

  const roleFromNavLinks = providedLinks.some((link) =>
    String(link.path || '').startsWith('/admin')
  )
    ? 'admin'
    : providedLinks.some((link) =>
        String(link.path || '').startsWith('/technician')
      )
      ? 'technician'
      : providedLinks.some((link) =>
          String(link.path || '').startsWith('/resident')
        )
        ? 'resident'
        : null;

  const normalizedRole =
    normalizeRole(userInfo.role) ||
    normalizeRole(user.role) ||
    normalizeRole(userInfo.subtitle) ||
    roleFromNavLinks ||
    roleFromPath ||
    'resident';

  const roleMeta = {
    admin: { label: 'Administrator', short: 'ADM' },
    technician: { label: 'Technician', short: 'TECH' },
    resident: { label: 'Resident', short: 'RES' },
    staff: { label: 'Staff', short: 'STF' },
  };

  const roleNavMap = {
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'All Requests', path: '/admin/requests' },
      { label: 'Users', path: '/admin/users' },
      { label: 'History', path: '/admin/history' },
    ],
    technician: [
      { label: 'Dashboard', path: '/technician/dashboard' },
      { label: 'My Tasks', path: '/technician/tasks' },
      { label: 'History', path: '/technician/history' },
    ],
    resident: [
      { label: 'Dashboard', path: '/resident/dashboard' },
      { label: 'Submit Request', path: '/resident/submit-request' },
      { label: 'My Requests', path: '/resident/my-requests' },
      { label: 'History', path: '/resident/history' },
    ],
    staff: [
      { label: 'Dashboard', path: '/resident/dashboard' },
      { label: 'Submit Request', path: '/resident/submit-request' },
      { label: 'My Requests', path: '/resident/my-requests' },
      { label: 'History', path: '/resident/history' },
    ],
  };

  const baseNavLinks =
    providedLinks.length > 0
      ? providedLinks
      : (roleNavMap[normalizedRole] || []);

  const routeToNavPath = {
    '/admin/request-details/': '/admin/requests',
    '/resident/request-details/': '/resident/my-requests',
    '/technician/task-details/': '/technician/tasks',
  };

  const resolvedPath =
    Object.entries(routeToNavPath).find(([prefix]) =>
      location.pathname.startsWith(prefix)
    )?.[1] || location.pathname;

  const normalizedNavLinks = baseNavLinks
    .filter((link) => link.path)
    .map((link) => ({
      ...link,
      active:
        resolvedPath === link.path || resolvedPath.startsWith(`${link.path}/`),
    }));

  const defaultDashboardLink =
    normalizedRole === 'admin'
      ? '/admin/dashboard'
      : normalizedRole === 'technician'
        ? '/technician/dashboard'
        : '/resident/dashboard';

  const profilePath =
    normalizedRole === 'admin'
      ? '/admin/profile'
      : normalizedRole === 'technician'
        ? '/technician/profile'
        : '/resident/profile';

  // Fetch unread notification count
  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.role = normalizedRole;

    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [normalizedRole]);

  useEffect(() => {
    document.documentElement.dataset.sidebar = isSidebarHidden
      ? 'hidden'
      : 'open';
    localStorage.setItem('sidebarHidden', String(isSidebarHidden));
  }, [isSidebarHidden]);

  useEffect(() => {
    // Close menus when navigating to keep UI state predictable.
    setShowDropdown(false);
    setShowNotifications(false);
    setIsMobileNavOpen(false);
  }, [location.pathname]);

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

  const toggleSidebar = () => {
    setShowDropdown(false);
    setShowNotifications(false);
    setIsSidebarHidden((prev) => !prev);
  };

  return (
    <>
      {isSidebarHidden && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex fixed top-4 left-4 z-50 h-14 w-14 items-center justify-center rounded-2xl border sidebar-border sidebar-surface shadow-md transition"
          aria-label="Show sidebar"
          title="Show sidebar"
        >
          <BuildingIcon />
        </button>
      )}

      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen w-72 sidebar-shell border-r flex-col z-40 overflow-hidden transition-transform duration-300 ${
          isSidebarHidden ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="px-6 py-6 border-b sidebar-border sidebar-section-header">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="grid place-items-center h-14 w-14 rounded-2xl border sidebar-border sidebar-surface transition"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent) 25%, transparent)',
                borderColor: 'color-mix(in srgb, var(--accent) 40%, #ffffff)',
              }}
              aria-label="Hide sidebar"
              title="Hide sidebar"
            >
              <BuildingIcon />
            </button>
            <Link to={userInfo.dashboardLink || defaultDashboardLink} className="min-w-0">
            <div>
              <h1 className="text-lg font-bold text-white">BuildingMMS</h1>
              <p className="text-xs sidebar-muted">Operations Console</p>
            </div>
            </Link>
          </div>
          <div className="mt-4">
            <span className="role-badge">
              {roleMeta[normalizedRole].short} · {roleMeta[normalizedRole].label}
            </span>
          </div>
        </div>

        <div className="px-4 py-5 flex-1 overflow-y-auto">
          <p className="px-3 text-[11px] uppercase tracking-[0.12em] sidebar-muted mb-3">
            Navigation
          </p>
          <nav className="space-y-2">
            {normalizedNavLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`sidebar-link group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  link.active
                    ? 'sidebar-link-active text-white shadow-sm'
                    : 'hover:text-white'
                }`}
              >
                <span className="sidebar-link-icon">
                  <NavGlyph label={link.label} />
                </span>
                <span className="sidebar-link-text">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-4 py-4 border-t sidebar-border space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl sidebar-surface transition text-sm font-semibold"
          >
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            <span>{isDark ? <SunIcon /> : <MoonIcon />}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-12 w-12 rounded-xl sidebar-surface grid place-items-center"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="relative flex-1" ref={userMenuRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl sidebar-surface sidebar-profile-card text-left"
              >
                <div>
                  <p className="text-sm font-bold text-white">{userInfo.name || 'User'}</p>
                  <p className="text-xs sidebar-muted">{userInfo.subtitle || ''}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] sidebar-muted font-semibold">
                    {roleMeta[normalizedRole].label}
                  </p>
                </div>
                <UserIcon />
              </button>

              {showDropdown && (
                <div className="absolute left-0 bottom-12 w-full bg-white rounded-lg shadow-lg py-1 z-50">
                  <Link
                    to={profilePath}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
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
          <div className="relative">
            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => {
                setShowNotifications(false);
                fetchUnreadCount();
              }}
              userRole={user.role}
              placement="up"
              mode="sidebar"
            />
          </div>
        </div>
      </aside>

      <nav className="lg:hidden mobile-nav-shell shadow-lg text-white">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              className="flex items-center space-x-3"
              aria-label={isMobileNavOpen ? 'Hide navigation menu' : 'Show navigation menu'}
            >
              <span className="grid place-items-center h-10 w-10 rounded-lg bg-white/15 border border-white/25">
                <BuildingIcon />
              </span>
              <div>
                <h1 className="text-lg font-bold text-white">BuildingMMS</h1>
                <p className="text-[10px] uppercase tracking-wide mobile-nav-muted">
                  {roleMeta[normalizedRole].short}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 mobile-nav-muted hover:text-white transition"
              >
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => {
                  setShowNotifications(false);
                  fetchUnreadCount();
                }}
                userRole={user.role}
                placement="down"
              />
            </div>
          </div>
        </div>

        {normalizedNavLinks.length > 0 && isMobileNavOpen && (
          <div className="border-t mobile-nav-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {normalizedNavLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    link.active
                      ? 'text-white'
                      : 'mobile-nav-link'
                  }`}
                  style={
                    link.active ? { backgroundColor: 'var(--accent)' } : undefined
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;

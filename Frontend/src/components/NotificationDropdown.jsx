import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/api';

function NotificationDropdown({
  isOpen,
  onClose,
  userRole,
  placement = 'down',
  mode = 'default',
}) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
      }

      // Navigate to the request
      if (notification.requestId) {
        if (userRole === 'admin') {
          navigate(`/admin/request-details/${notification.requestId}`);
        } else if (userRole === 'resident' || userRole === 'staff') {
          navigate(`/resident/request-details/${notification.requestId}`);
        } else if (userRole === 'technician') {
          navigate(`/technician/task-details/${notification.requestId}`);
        }
      }

      onClose();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationTag = (type) => {
    switch (type) {
      case 'new_request':
        return { label: 'NEW', className: 'bg-blue-100 text-blue-700' };
      case 'assigned':
        return { label: 'ASSIGN', className: 'bg-purple-100 text-purple-700' };
      case 'status_update':
        return { label: 'UPDATE', className: 'bg-emerald-100 text-emerald-700' };
      default:
        return { label: 'INFO', className: 'bg-gray-100 text-gray-700' };
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return 'Just now';
  };

  if (!isOpen) return null;

  const dropdownPositionClass =
    mode === 'sidebar'
      ? 'fixed bottom-6 left-6 lg:bottom-8 lg:left-80'
      : placement === 'up'
        ? 'fixed left-2 right-2 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:absolute sm:left-auto sm:right-0 sm:bottom-full sm:mb-2'
        : 'fixed left-2 right-2 top-[max(5rem,calc(env(safe-area-inset-top)+1rem))] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2';

  const dropdownSizeClass =
    mode === 'sidebar'
      ? 'w-[min(92vw,32rem)] sm:w-96 max-h-[calc(100vh-10rem)] lg:max-h-[calc(100vh-8rem)]'
      : 'w-auto sm:w-96 sm:max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-8rem)] sm:max-h-[32rem]';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      {/* Dropdown */}
      <div className={`${dropdownPositionClass} ${dropdownSizeClass} bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary hover:text-blue-700 font-medium whitespace-nowrap"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="sm:hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close notifications"
            >
              X
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1 scroll-smooth" style={{ scrollPaddingTop: '0.5rem', scrollPaddingBottom: '0.5rem' }}>
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <span className="inline-flex h-12 w-12 mx-auto rounded-full bg-gray-100 items-center justify-center text-gray-600 text-xl mb-2">
                N
              </span>
              <p className="text-gray-600">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                (() => {
                  const tag = getNotificationTag(notification.type);
                  return (
                <button
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`text-xs font-semibold px-2 py-1 rounded-md h-fit flex-shrink-0 ${tag.className}`}
                    >
                      {tag.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium text-gray-900 ${
                          !notification.isRead ? 'font-bold' : ''
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </button>
                  );
                })()
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NotificationDropdown;

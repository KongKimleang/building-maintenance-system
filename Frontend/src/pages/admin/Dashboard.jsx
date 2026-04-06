import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getAllRequests, getRequestStats } from '../../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
    byCategory: [],
    byPriority: [],
    recent: []
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await getRequestStats();
      const requestsData = await getAllRequests();

      setStats(statsData.stats);
      setRecentRequests(requestsData.requests.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userInfo={{
          name: 'Admin',
          dashboardLink: '/admin/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/admin/dashboard', active: true },
            { label: 'Users', path: '/admin/users', active: false },
            { label: 'Requests', path: '/admin/requests', active: false }
          ]
        }}
        notificationCount={3}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>

              {/* Pending */}
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                  </div>
                  <span className="text-5xl opacity-50">⏰</span>
                </div>
              </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-warning mt-2">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats.inProgress}</p>
              </div>

              {/* Completed */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold mt-2">{stats.completed}</p>
                  </div>
                  <span className="text-5xl opacity-50">✅</span>
                </div>
              </div>
            </div>

          {/* Completed */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-success mt-2">{stats.completed}</p>
              </div>

              {/* By Priority */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requests by Priority</h2>
                <div className="space-y-3">
                  {stats.byPriority && stats.byPriority.length > 0 ? (
                    stats.byPriority.map((item, index) => {
                      const percentage = ((item.count / stats.total) * 100).toFixed(0);
                      const colors = {
                        High: 'bg-red-500',
                        Medium: 'bg-yellow-500',
                        Low: 'bg-green-500'
                      };
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {item._id === 'High' ? '🔴' : item._id === 'Medium' ? '🟡' : '🟢'} {item._id || 'Unknown'}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${colors[item._id] || 'bg-gray-500'} h-2 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No data available</p>
                  )}
                </div>
              </div>
            </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Maintenance Requests</h2>
            <Link to="/admin/requests" className="text-primary hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600">
                      Loading requests...
                    </td>
                  </tr>
                ) : recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-600">
                      No requests yet
                    </td>
                  </tr>
                ) : (
                  recentRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        #{request.requestId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {request.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.priority === 'High' ? 'bg-red-100 text-red-800' :
                          request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.priority === 'High' ? '🔴' : request.priority === 'Medium' ? '🟡' : '🟢'} {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                          request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/request-details/${request._id}`)}
                          className="text-primary hover:text-blue-700 font-medium"
                        >
                          View
                        </button>
                        {!request.assignedTo && (
                          <button className="text-success hover:text-green-700 font-medium">
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
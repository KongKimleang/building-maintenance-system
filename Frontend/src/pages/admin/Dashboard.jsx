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
    recent: [],
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
          name: `${user.firstName} ${user.lastName}`,
          subtitle: 'Administrator',
          dashboardLink: '/admin/dashboard',
        }}
        navLinks={[
          { label: 'Dashboard', path: '/admin/dashboard', active: true },
          { label: 'All Requests', path: '/admin/requests', active: false },
          { label: 'Users', path: '/admin/users', active: false },
          { label: 'History', path: '/admin/history', active: false },
        ]}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow">
          <p className="text-xs uppercase tracking-[0.12em] text-gray-500">Operations Overview</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user.firstName}! Here's your system overview.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {/* Total Requests */}
              <div className="bg-white rounded-lg shadow p-5 border-t-4 border-blue-600">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-lg shadow p-5 border-t-4 border-slate-500">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
                </div>
              </div>

              {/* Assigned */}
              <div className="bg-white rounded-lg shadow p-5 border-t-4 border-violet-500">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Assigned</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.assigned}</p>
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-white rounded-lg shadow p-5 border-t-4 border-amber-500">
                <div>
                  <p className="text-gray-600 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</p>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-lg shadow p-5 border-t-4 border-emerald-600">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* By Category */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Requests by Category
                </h2>
                <div className="space-y-3">
                  {stats.byCategory && stats.byCategory.length > 0 ? (
                    stats.byCategory.map((item, index) => {
                      const percentage = (
                        (item.count / stats.total) *
                        100
                      ).toFixed(0);
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {item._id || 'Unknown'}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.count}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
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

              {/* By Priority */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Requests by Priority
                </h2>
                <div className="space-y-3">
                  {stats.byPriority && stats.byPriority.length > 0 ? (
                    stats.byPriority.map((item, index) => {
                      const percentage = (
                        (item.count / stats.total) *
                        100
                      ).toFixed(0);
                      const colors = {
                        High: 'bg-red-500',
                        Medium: 'bg-yellow-500',
                        Low: 'bg-green-500',
                      };
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <span
                                className={`inline-block h-2.5 w-2.5 rounded-full ${
                                  item._id === 'High'
                                    ? 'bg-red-500'
                                    : item._id === 'Medium'
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                }`}
                              ></span>
                              {item._id || 'Unknown'}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.count}
                            </span>
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
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Requests
                </h2>
                <button
                  onClick={() => navigate('/admin/requests')}
                  className="text-primary hover:text-blue-700 font-medium text-sm"
                >
                  View all requests
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Submitted By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{request.requestId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {request.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              request.priority === 'High'
                                ? 'bg-red-100 text-red-800'
                                : request.priority === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === 'Pending'
                                ? 'bg-gray-100 text-gray-800'
                                : request.status === 'Assigned'
                                  ? 'bg-purple-100 text-purple-800'
                                  : request.status === 'In Progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {request.submittedBy
                            ? `${request.submittedBy.firstName} ${request.submittedBy.lastName}`
                            : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              navigate(`/admin/request-details/${request._id}`)
                            }
                            className="text-primary hover:text-blue-700 font-medium"
                          >
                            View Details
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

export default Dashboard;

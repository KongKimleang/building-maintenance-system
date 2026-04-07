import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getAllRequests } from '../../services/api';

function History() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();

      const myCompletedTasks = (data?.requests || [])
        .filter((req) => req.assignedTo && req.assignedTo._id === user.id)
        .filter((req) => req.status === 'Completed' || req.status === 'Cancelled');

      setTasks(myCompletedTasks);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const statusCounts = useMemo(
    () => ({
      all: tasks.length,
      completed: tasks.filter((task) => task.status === 'Completed').length,
      cancelled: tasks.filter((task) => task.status === 'Cancelled').length,
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (statusFilter === 'All') return true;
        return task.status === statusFilter;
      })
      .filter((task) => {
        if (dateRange === 'all') return true;

        const updatedAt = task.updatedAt ? new Date(task.updatedAt) : null;
        if (!updatedAt || Number.isNaN(updatedAt.getTime())) return false;

        const now = new Date();
        const days = dateRange === '7d' ? 7 : 30;
        const threshold = new Date(now);
        threshold.setDate(now.getDate() - days);

        return updatedAt >= threshold;
      })
      .filter((task) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;

        return (
          String(task.requestId || '').toLowerCase().includes(term) ||
          String(task.title || '').toLowerCase().includes(term) ||
          String(task.category || '').toLowerCase().includes(term)
        );
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [tasks, searchTerm, statusFilter, dateRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userInfo={{
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          subtitle: user.specialization || 'Technician',
          dashboardLink: '/technician/dashboard',
        }}
        navLinks={[
          { label: 'Dashboard', path: '/technician/dashboard' },
          { label: 'My Tasks', path: '/technician/tasks' },
          { label: 'History', path: '/technician/history' },
        ]}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="role-badge">Technician History</span>
          <h1 className="text-3xl font-bold text-gray-900">Task History</h1>
          <p className="role-subtext mt-1">
            View your completed and cancelled tasks
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === 'All'
                  ? 'bg-primary text-white'
                  : 'bg-blue-50 text-blue-700 hover:opacity-90'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === 'Completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Completed ({statusCounts.completed})
            </button>
            <button
              onClick={() => setStatusFilter('Cancelled')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                statusFilter === 'Cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Cancelled ({statusCounts.cancelled})
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setDateRange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                dateRange === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-blue-50 text-blue-700 hover:opacity-90'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('7d')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                dateRange === '7d'
                  ? 'bg-primary text-white'
                  : 'bg-blue-50 text-blue-700 hover:opacity-90'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                dateRange === '30d'
                  ? 'bg-primary text-white'
                  : 'bg-blue-50 text-blue-700 hover:opacity-90'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by ID, title, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
            Loading history...
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">Error: {error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <span className="mx-auto mb-4 block h-14 w-14 rounded-xl bg-blue-50"></span>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No task history yet</h2>
            <p className="text-gray-600">
              Try changing the status/date filter or search term.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Update
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <p className="font-semibold text-gray-900">
                          #{task.requestId} {task.title}
                        </p>
                        <p className="text-gray-500">{task.category}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {task.submittedBy
                          ? `${task.submittedBy.firstName} ${task.submittedBy.lastName}`
                          : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {task.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {task.updatedAt
                          ? new Date(task.updatedAt).toLocaleString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/technician/task-details/${task._id}`)}
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
        )}
      </main>
    </div>
  );
}

export default History;

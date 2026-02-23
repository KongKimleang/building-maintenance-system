import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getAllRequests as fetchAllRequests } from '../../services/api';

function TechnicianDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await fetchAllRequests();
      // Filter only requests assigned to this technician
      const myTasks = data.requests.filter(r => 
        r.assignedTo && r.assignedTo._id === user.id
      );
      setAllRequests(myTasks);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const tasksToday = allRequests.filter(r => {
    const today = new Date().toDateString();
    const assignedDate = new Date(r.createdAt).toDateString();
    return assignedDate === today;
  });

  const stats = {
    tasksToday: tasksToday.length,
    pending: allRequests.filter(r => r.status === 'Pending' || r.status === 'Assigned').length,
    completedToday: tasksToday.filter(r => r.status === 'Completed').length
  };

  // Active tasks (Pending, Assigned, In Progress)
  const activeTasks = allRequests.filter(r => 
    r.status !== 'Completed' && r.status !== 'Cancelled'
  ).slice(0, 3);

  // Completed tasks
  const completedTasks = allRequests.filter(r => 
    r.status === 'Completed'
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: `${user.firstName} ${user.lastName}`,
          subtitle: user.specialization,
          dashboardLink: '/technician/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/technician/dashboard', active: true },
            { label: 'My Tasks', path: '/technician/tasks', active: false },
            { label: 'History', path: '/technician/history', active: false }
          ]
        }}
        notificationCount={5}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.firstName}!</h1>
          <p className="text-gray-600 mt-1">{user.specialization} • Maintenance Department</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Tasks Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tasksToday}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-warning mt-2">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>

          {/* Completed Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-success mt-2">{stats.completedToday}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assigned Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">🔥 My Assigned Tasks</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {loading ? (
                    <p className="text-gray-600 text-center py-8">Loading tasks...</p>
                  ) : activeTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-6xl mb-4 block">✅</span>
                      <p className="text-gray-600">No active tasks. Great work!</p>
                    </div>
                  ) : (
                    activeTasks.map((task) => (
                      <div key={task._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                #{task.requestId} {task.title}
                              </h3>
                              
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority === 'High' ? '🔴' : task.priority === 'Medium' ? '🟡' : '🟢'} {task.priority}
                              </span>

                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                task.status === 'Pending' || task.status === 'Assigned' ? 'bg-gray-100 text-gray-800' :
                                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">📍 Location:</span> {task.location}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">👤 Resident:</span> {task.submittedBy ? `${task.submittedBy.firstName} ${task.submittedBy.lastName}` : 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">📞</span> {task.submittedBy?.phone || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">📅 Assigned:</span> {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                            <span className="font-medium">Description:</span> {task.description}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {(task.status === 'Pending' || task.status === 'Assigned') && (
                            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition text-sm font-medium">
                              🚀 Start Task
                            </button>
                          )}
                          {task.status === 'In Progress' && (
                            <>
                              <button className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 transition text-sm font-medium">
                                ✅ Mark Complete
                              </button>
                              <button className="px-4 py-2 bg-warning text-white rounded-md hover:bg-yellow-600 transition text-sm font-medium">
                                💬 Add Update
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => navigate(`/technician/task-details/${task._id}`)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                          >
                            👁️ View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">✅ Completed Today</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {completedTasks.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No completed tasks yet</p>
                  ) : (
                    completedTasks.map((task) => (
                      <div key={task._id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                              <span className="text-lg">✅</span>
                            </span>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">#{task.requestId}</p>
                            <p className="text-sm text-gray-600">{task.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{task.location}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(task.completedDate || task.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TechnicianDashboard;
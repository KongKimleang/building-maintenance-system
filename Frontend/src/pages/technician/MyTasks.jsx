import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getAllRequests, updateRequestStatus } from '../../services/api';

function MyTasks() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [filter, setFilter] = useState('All');
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch tasks from database
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();

      // Filter only tasks assigned to this technician
      const myTasks = data.requests.filter(
        (req) => req.assignedTo && req.assignedTo._id === user.id
      );

      setAllTasks(myTasks);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Open status update modal
  const handleOpenStatusModal = (task, status) => {
    setSelectedTask(task);
    setNewStatus(status);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (newStatus === 'Completed' && !statusNotes.trim()) {
      alert('Please add completion notes');
      return;
    }

    try {
      setUpdateLoading(true);
      await updateRequestStatus(selectedTask._id, newStatus, statusNotes);

      const statusMessage =
        newStatus === 'In Progress' ? 'Task started!' : 'Task completed!';
      alert(`✅ ${statusMessage}`);

      setShowStatusModal(false);
      setSelectedTask(null);
      setStatusNotes('');
      await fetchTasks(); // Refresh list
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to update status'));
    } finally {
      setUpdateLoading(false);
    }
  };

  // Filter tasks
  const filteredTasks =
    filter === 'All'
      ? allTasks
      : allTasks.filter((task) => task.status === filter);

  // Count by status
  const statusCounts = {
    all: allTasks.length,
    assigned: allTasks.filter((t) => t.status === 'Assigned').length,
    inProgress: allTasks.filter((t) => t.status === 'In Progress').length,
    completed: allTasks.filter((t) => t.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          subtitle: user.specialization || 'Technician',
          dashboardLink: '/technician/dashboard',
          navLinks: [
            {
              label: 'Dashboard',
              path: '/technician/dashboard',
              active: false,
            },
            { label: 'My Tasks', path: '/technician/tasks', active: true },
            { label: 'History', path: '/technician/history', active: false },
          ],
        }}
        notificationCount={5}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Assigned Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your maintenance tasks
          </p>
        </div>

        {/* Filter Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setFilter('All')}
            className={`p-4 rounded-lg border-2 transition ${
              filter === 'All'
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">All Tasks</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {statusCounts.all}
            </p>
          </button>

          <button
            onClick={() => setFilter('Assigned')}
            className={`p-4 rounded-lg border-2 transition ${
              filter === 'Assigned'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">Assigned</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {statusCounts.assigned}
            </p>
          </button>

          <button
            onClick={() => setFilter('In Progress')}
            className={`p-4 rounded-lg border-2 transition ${
              filter === 'In Progress'
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {statusCounts.inProgress}
            </p>
          </button>

          <button
            onClick={() => setFilter('Completed')}
            className={`p-4 rounded-lg border-2 transition ${
              filter === 'Completed'
                ? 'border-success bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-success mt-1">
              {statusCounts.completed}
            </p>
          </button>
        </div>

        {/* Active Filter Badge */}
        {filter !== 'All' && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing:</span>
            <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
              {filter}
            </span>
            <button
              onClick={() => setFilter('All')}
              className="text-sm text-primary hover:text-blue-700 font-medium"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTasks.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {filter !== 'All' ? filter.toLowerCase() : ''} tasks found
            </h3>
            <p className="text-gray-600">
              {filter === 'All'
                ? "You don't have any assigned tasks yet."
                : `You don't have any ${filter.toLowerCase()} tasks.`}
            </p>
          </div>
        )}

        {/* Tasks List */}
        {!loading && !error && filteredTasks.length > 0 && (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">
                          #{task.requestId} {task.title}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'Assigned'
                              ? 'bg-purple-100 text-purple-800'
                              : task.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.status}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            task.priority === 'High'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority === 'High'
                            ? '🔴'
                            : task.priority === 'Medium'
                              ? '🟡'
                              : '🟢'}{' '}
                          {task.priority}
                        </span>

                        {/* Category Badge */}
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Task Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">📍 Location:</span>{' '}
                        {task.location}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Floor {task.floor}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">👤 Resident:</span>{' '}
                        {task.submittedBy
                          ? `${task.submittedBy.firstName} ${task.submittedBy.lastName}`
                          : 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">📞</span>{' '}
                        {task.submittedBy?.phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">📅 Created:</span>{' '}
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Unit:</span> {task.unit}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Description:
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {task.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        navigate(`/technician/task-details/${task._id}`)
                      }
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium text-sm"
                    >
                      📋 View Details
                    </button>

                    {task.status === 'Assigned' && (
                      <button
                        onClick={() =>
                          handleOpenStatusModal(task, 'In Progress')
                        }
                        className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 transition font-medium text-sm"
                      >
                        🚀 Start Task
                      </button>
                    )}

                    {task.status === 'In Progress' && (
                      <button
                        onClick={() => handleOpenStatusModal(task, 'Completed')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition font-medium text-sm"
                      >
                        ✅ Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Update Status Modal */}
      {showStatusModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {newStatus === 'In Progress' ? 'Start Task' : 'Complete Task'}
            </h2>

            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Request:</p>
              <p className="font-semibold text-gray-900">
                #{selectedTask.requestId} {selectedTask.title}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Current Status: {selectedTask.status}
              </p>
              <p className="text-sm text-success mt-1">
                New Status: {newStatus}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Notes{' '}
                {newStatus === 'Completed' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows="4"
                placeholder={
                  newStatus === 'Completed'
                    ? 'Describe the work completed, parts used, any issues found...'
                    : 'Add any notes about starting this task...'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedTask(null);
                  setStatusNotes('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={
                  updateLoading ||
                  (newStatus === 'Completed' && !statusNotes.trim())
                }
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {updateLoading
                  ? 'Updating...'
                  : newStatus === 'In Progress'
                    ? 'Start Task'
                    : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTasks;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
  getRequestById,
  updateRequestStatus,
  addComment,
} from '../../services/api';

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const data = await getRequestById(id);
      setRequest(data.request);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (status) => {
    setNewStatus(status);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (newStatus === 'Completed' && !statusNotes.trim()) {
      alert('Please add completion notes');
      return;
    }

    try {
      setUpdateLoading(true);
      await updateRequestStatus(request._id, newStatus, statusNotes);

      const statusMessage =
        newStatus === 'In Progress' ? 'Task started!' : 'Task completed!';
      alert(`✅ ${statusMessage}`);

      setShowStatusModal(false);
      setStatusNotes('');
      await fetchTaskDetails(); // Refresh
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to update status'));
    } finally {
      setUpdateLoading(false);
    }
  };

  // Add comment handler
  const handleAddComment = async (comment) => {
    try {
      await addComment(request._id, comment);
      alert('✅ Note added successfully!');
      await fetchTaskDetails(); // Refresh
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to add note'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
            ],
          }}
          notificationCount={5}
        />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading task details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50">
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
            ],
          }}
          notificationCount={5}
        />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            Error: {error || 'Task not found'}
          </div>
          <button
            onClick={() => navigate('/technician/tasks')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
          >
            ← Back to My Tasks
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          ],
        }}
        notificationCount={5}
      />

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/technician/tasks')}
          className="mb-4 flex items-center text-primary hover:text-blue-700 font-medium"
        >
          ← Back to My Tasks
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Task #{request.requestId}
              </h1>
              <p className="text-xl text-gray-700">{request.title}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Status Badge */}
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-full ${
                  request.status === 'Assigned'
                    ? 'bg-purple-100 text-purple-800'
                    : request.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {request.status}
              </span>
              {/* Priority Badge */}
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-full ${
                  request.priority === 'High'
                    ? 'bg-red-100 text-red-800'
                    : request.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {request.priority === 'High'
                  ? '🔴'
                  : request.priority === 'Medium'
                    ? '🟡'
                    : '🟢'}{' '}
                {request.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Task Details
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Category</p>
                  <p className="text-gray-900">{request.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-gray-900">{request.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Floor</p>
                  <p className="text-gray-900">{request.floor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Unit</p>
                  <p className="text-gray-900">{request.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Submitted Date
                  </p>
                  <p className="text-gray-900">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Assigned Date
                  </p>
                  <p className="text-gray-900">
                    {new Date(request.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Problem Description
                </p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                  {request.description}
                </p>
              </div>

              {/* Photo */}
              {request.photo && request.photo.data && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Problem Photo
                  </p>
                  <img
                    src={`data:${request.photo.contentType};base64,${request.photo.data}`}
                    alt="Problem photo"
                    className="max-w-md rounded-lg border-2 border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Work Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Work Timeline
              </h2>

              {request.timeline && request.timeline.length > 0 ? (
                <div className="space-y-4">
                  {request.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-success' : 'bg-primary'
                          }`}
                        ></div>
                        {index !== request.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-gray-900">
                          {event.action}
                        </p>
                        {event.note && (
                          <p className="text-sm text-gray-600 mt-1 bg-blue-50 p-2 rounded">
                            {event.note}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No timeline events yet</p>
              )}
            </div>

            {/* Action Buttons */}
            {request.status !== 'Completed' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Actions
                </h2>
                <div className="flex gap-3 flex-wrap">
                  {request.status === 'Assigned' && (
                    <button
                      onClick={() => handleOpenStatusModal('In Progress')}
                      className="px-6 py-3 bg-success text-white rounded-md hover:bg-green-700 font-medium"
                    >
                      🚀 Start Task
                    </button>
                  )}

                  {request.status === 'In Progress' && (
                    <button
                      onClick={() => handleOpenStatusModal('Completed')}
                      className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
                    >
                      ✅ Mark Complete
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const comment = prompt('Add work note or update:');
                      if (comment && comment.trim()) {
                        handleAddComment(comment);
                      }
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                  >
                    💬 Add Note
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resident Contact */}
            {request.submittedBy && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Resident Contact
                </h3>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {request.submittedBy.firstName}{' '}
                    {request.submittedBy.lastName}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Unit:</span>{' '}
                    {request.submittedBy.unit || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Phone:</span>{' '}
                    {request.submittedBy.phone}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Email:</span>{' '}
                    {request.submittedBy.email}
                  </p>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <a
                      href={`tel:${request.submittedBy.phone}`}
                      className="block w-full text-center px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 font-medium"
                    >
                      📞 Call Resident
                    </a>
                    <a
                      href={`mailto:${request.submittedBy.email}`}
                      className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                    >
                      📧 Send Email
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Task Status Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>

              {request.status === 'Assigned' && (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <p className="font-semibold text-gray-900">
                    ⏰ Ready to Start
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    This task has been assigned to you. Click "Start Task" when
                    you begin work.
                  </p>
                </div>
              )}

              {request.status === 'In Progress' && (
                <div className="bg-blue-50 border-l-4 border-primary p-4">
                  <p className="font-semibold text-gray-900">🔵 In Progress</p>
                  <p className="text-sm text-gray-700 mt-1">
                    You're currently working on this task. Mark it complete when
                    finished.
                  </p>
                </div>
              )}

              {request.status === 'Completed' && (
                <div className="bg-green-50 border-l-4 border-success p-4">
                  <p className="font-semibold text-gray-900">✅ Completed</p>
                  <p className="text-sm text-gray-700 mt-1">
                    This task has been completed successfully!
                  </p>
                </div>
              )}
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Navigation
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/technician/tasks')}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  View All My Tasks
                </button>
                <button
                  onClick={() => navigate('/technician/dashboard')}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {newStatus === 'In Progress' ? 'Start Task' : 'Complete Task'}
            </h2>

            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Task:</p>
              <p className="font-semibold text-gray-900">
                #{request.requestId} {request.title}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Current Status: {request.status}
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

export default TaskDetails;

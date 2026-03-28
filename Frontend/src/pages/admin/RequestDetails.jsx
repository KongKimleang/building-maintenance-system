import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
  getRequestById,
  assignTechnician,
  getAllTechnicians,
  addComment,
} from '../../services/api';

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRequestDetails();
    fetchTechnicians();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const data = await getRequestById(id);
      setRequest(data.request);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const data = await getAllTechnicians();
      setTechnicians(data.technicians);
    } catch (err) {
      console.error('Failed to fetch technicians:', err);
    }
  };

  const handleOpenAssignModal = () => {
    setSelectedTechnicianId(request.assignedTo?._id || '');
    setShowAssignModal(true);
  };

  const handleAssignTechnician = async () => {
    if (!selectedTechnicianId) {
      alert('Please select a technician');
      return;
    }

    try {
      setAssignLoading(true);
      await assignTechnician(request._id, selectedTechnicianId);

      const selectedTech = technicians.find(
        (t) => t._id === selectedTechnicianId
      );
      alert(
        `✅ Successfully assigned to ${selectedTech.firstName} ${selectedTech.lastName}!`
      );

      setShowAssignModal(false);
      await fetchRequestDetails(); // Refresh to show updated assignment
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to assign technician'));
    } finally {
      setAssignLoading(false);
    }
  };

  // Add comment handler
  const handleAddComment = async (comment) => {
    try {
      await addComment(request._id, comment);
      alert('✅ Note added successfully!');
      await fetchRequestDetails(); // Refresh
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
            subtitle: 'Administrator',
            dashboardLink: '/admin/dashboard',
            navLinks: [
              { label: 'Dashboard', path: '/admin/dashboard', active: false },
              { label: 'All Requests', path: '/admin/requests', active: true },
              { label: 'Users', path: '/admin/users', active: false },
            ],
          }}
          notificationCount={8}
        />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading request details...</p>
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
            subtitle: 'Administrator',
            dashboardLink: '/admin/dashboard',
            navLinks: [
              { label: 'Dashboard', path: '/admin/dashboard', active: false },
              { label: 'All Requests', path: '/admin/requests', active: true },
              { label: 'Users', path: '/admin/users', active: false },
            ],
          }}
          notificationCount={8}
        />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            Error: {error || 'Request not found'}
          </div>
          <button
            onClick={() => navigate('/admin/requests')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
          >
            ← Back to All Requests
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
          subtitle: 'Administrator',
          dashboardLink: '/admin/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/admin/dashboard', active: false },
            { label: 'All Requests', path: '/admin/requests', active: true },
            { label: 'Users', path: '/admin/users', active: false },
          ],
        }}
        notificationCount={8}
      />

      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/requests')}
          className="mb-4 flex items-center text-primary hover:text-blue-700 font-medium"
        >
          ← Back to All Requests
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Request #{request.requestId}
              </h1>
              <p className="text-xl text-gray-700">{request.title}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Status Badge */}
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-full ${
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
            {/* Request Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Request Details
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
                {request.completedDate && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Completed Date
                    </p>
                    <p className="text-gray-900">
                      {new Date(request.completedDate).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium mb-2">
                  Description
                </p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                  {request.description}
                </p>
              </div>

              {/* Photo */}
              {request.photo && request.photo.data && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Attached Photo
                  </p>
                  <img
                    src={`data:${request.photo.contentType};base64,${request.photo.data}`}
                    alt="Request photo"
                    className="max-w-md rounded-lg border-2 border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Resident Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resident Information
              </h2>
              {request.submittedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Name</p>
                    <p className="text-gray-900">
                      {request.submittedBy.firstName}{' '}
                      {request.submittedBy.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Unit</p>
                    <p className="text-gray-900">
                      {request.submittedBy.unit || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="text-gray-900">{request.submittedBy.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                    <p className="text-gray-900">{request.submittedBy.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Request Timeline
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Technician */}
            {request.assignedTo && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Assigned Technician
                </h3>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {request.assignedTo.firstName} {request.assignedTo.lastName}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Specialization:</span>{' '}
                    {request.assignedTo.specialization}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Phone:</span>{' '}
                    {request.assignedTo.phone}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Email:</span>{' '}
                    {request.assignedTo.email}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {!request.assignedTo && (
                  <button
                    onClick={handleOpenAssignModal}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Assign Technician
                  </button>
                )}

                {request.assignedTo && request.status !== 'Completed' && (
                  <button
                    onClick={handleOpenAssignModal}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Reassign Technician
                  </button>
                )}

                <button
                  onClick={() => {
                    const comment = prompt('Add admin note:');
                    if (comment && comment.trim()) {
                      handleAddComment(comment);
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                >
                  💬 Add Note
                </button>

                <button
                  onClick={() => navigate('/admin/requests')}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  Back to All Requests
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Quick Stats
              </h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Created:</span>{' '}
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(request.updatedAt).toLocaleDateString()}
              </p>
              {request.completedDate && (
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Completed:</span>{' '}
                  {new Date(request.completedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Assign Technician Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {request.assignedTo ? 'Reassign Technician' : 'Assign Technician'}
            </h2>

            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Request:</p>
              <p className="font-semibold text-gray-900">
                #{request.requestId} {request.title}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Category: {request.category}
              </p>
              <p className="text-sm text-gray-600">
                Priority: {request.priority}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Technician
              </label>
              <select
                value={selectedTechnicianId}
                onChange={(e) => setSelectedTechnicianId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Select a technician --</option>
                {technicians.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.firstName} {tech.lastName} - {tech.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTechnician}
                disabled={assignLoading || !selectedTechnicianId}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {assignLoading
                  ? 'Assigning...'
                  : request.assignedTo
                    ? 'Reassign'
                    : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestDetails;

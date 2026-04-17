import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
  getAllRequests,
  getAllTechnicians,
  assignTechnician,
  deleteRequest,
} from '../../services/api';

function AllRequests() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, filterStatus, filterPriority, searchTerm]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();
      setRequests(data.requests);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load requests');
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

  const applyFilters = () => {
    let filtered = [...requests];

    if (filterStatus !== 'All') {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }

    if (filterPriority !== 'All') {
      filtered = filtered.filter((req) => req.priority === filterPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleOpenAssignModal = (request) => {
    setSelectedRequest(request);
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
      await assignTechnician(selectedRequest._id, selectedTechnicianId);

      const selectedTech = technicians.find(
        (t) => t._id === selectedTechnicianId
      );
      alert(
        `Successfully assigned to ${selectedTech.firstName} ${selectedTech.lastName}.`
      );

      setShowAssignModal(false);
      await fetchRequests();
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to assign technician'));
    } finally {
      setAssignLoading(false);
    }
  };

  const handleOpenDeleteModal = (request) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const handleDeleteRequest = async () => {
    try {
      setDeleteLoading(true);
      await deleteRequest(requestToDelete._id);

      alert('Request deleted successfully.');
      setShowDeleteModal(false);
      setRequestToDelete(null);
      await fetchRequests();
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to delete request'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'Pending').length,
    assigned: requests.filter((r) => r.status === 'Assigned').length,
    inProgress: requests.filter((r) => r.status === 'In Progress').length,
    completed: requests.filter((r) => r.status === 'Completed').length,
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
          { label: 'Dashboard', path: '/admin/dashboard', active: false },
          { label: 'All Requests', path: '/admin/requests', active: true },
          { label: 'Users', path: '/admin/users', active: false },
          { label: 'History', path: '/admin/history', active: false },
        ]}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow">
          <p className="text-xs uppercase tracking-[0.12em] text-gray-500">Request Operations</p>
          <h1 className="text-3xl font-bold text-gray-900">
            All Maintenance Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and assign maintenance requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <button
            onClick={() => setFilterStatus('All')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'All'
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">All Requests</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {statusCounts.all}
            </p>
          </button>

          <button
            onClick={() => setFilterStatus('Pending')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'Pending'
                ? 'border-warning bg-yellow-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-warning mt-1">
              {statusCounts.pending}
            </p>
          </button>

          <button
            onClick={() => setFilterStatus('Assigned')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'Assigned'
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
            onClick={() => setFilterStatus('In Progress')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'In Progress'
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
            onClick={() => setFilterStatus('Completed')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'Completed'
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by ID, title, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('All');
                  setFilterPriority('All');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">Loading requests...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No requests found
              </h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
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
                      Assigned To
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
                  {filteredRequests.map((request) => (
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
                        {request.assignedTo ? (
                          `${request.assignedTo.firstName} ${request.assignedTo.lastName}`
                        ) : (
                          <span className="text-gray-400 italic">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.submittedBy
                          ? `${request.submittedBy.firstName} ${request.submittedBy.lastName}`
                          : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/request-details/${request._id}`)
                          }
                          className="text-primary hover:text-blue-700 font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenAssignModal(request)}
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          {request.assignedTo ? 'Reassign' : 'Assign'}
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(request)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Assign Technician Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedRequest.assignedTo
                ? 'Reassign Technician'
                : 'Assign Technician'}
            </h2>

            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Request:</p>
              <p className="font-semibold text-gray-900">
                #{selectedRequest.requestId} {selectedRequest.title}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Category: {selectedRequest.category}
              </p>
              <p className="text-sm text-gray-600">
                Priority: {selectedRequest.priority}
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
                  : selectedRequest.assignedTo
                    ? 'Reassign'
                    : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && requestToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Delete Request
            </h2>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this request? This action cannot
                be undone.
              </p>
              <div className="p-4 bg-red-50 rounded border border-red-200">
                <p className="text-sm text-gray-600 mb-1">Request:</p>
                <p className="font-semibold text-gray-900">
                  #{requestToDelete.requestId} {requestToDelete.title}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Category: {requestToDelete.category}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {requestToDelete.status}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRequestToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRequest}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllRequests;

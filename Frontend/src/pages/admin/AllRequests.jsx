import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getAllRequests as fetchAllRequests } from '../../services/api';
import { assignTechnician, getAllTechnicians } from '../../services/api';

function AllRequests() {
  const navigate = useNavigate();
  
  // Filters state
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  // Fetch requests from database
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchAllRequests();
      setAllRequests(data.requests);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  // Fetch technicians
  const fetchTechnicians = async () => {
    try {
      const data = await getAllTechnicians();
      setTechnicians(data.technicians);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  // Open assign modal
  const handleOpenAssignModal = async (request) => {
    setSelectedRequest(request);
    setShowAssignModal(true);
    await fetchTechnicians();
  };

  // Handle assign technician
  const handleAssignTechnician = async () => {
    if (!selectedTechnicianId) {
      alert('Please select a technician');
      return;
    }

    try {
      setAssignLoading(true);
      await assignTechnician(selectedRequest._id, selectedTechnicianId);
      alert('✅ Technician assigned successfully!');
      setShowAssignModal(false);
      setSelectedRequest(null);
      setSelectedTechnicianId('');
      await fetchRequests(); // Refresh list
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to assign technician'));
    } finally {
      setAssignLoading(false);
    }
  };

  // Apply filters
  let filteredRequests = allRequests;

  // Status filter
  if (statusFilter !== 'All') {
    filteredRequests = filteredRequests.filter(req => req.status === statusFilter);
  }

  // Priority filter
  if (priorityFilter !== 'All') {
    filteredRequests = filteredRequests.filter(req => req.priority === priorityFilter);
  }

  // Category filter
  if (categoryFilter !== 'All') {
    filteredRequests = filteredRequests.filter(req => req.category === categoryFilter);
  }

  // Search filter (need to change tittle & location if error occur)
  if (searchQuery) {
    filteredRequests = filteredRequests.filter(req =>
      (req.requestId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.submittedBy && `${req.submittedBy.firstName} ${req.submittedBy.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Count by status
  const statusCounts = {
    all: allRequests.length,
    pending: allRequests.filter(r => r.status === 'Pending').length,
    assigned: allRequests.filter(r => r.status === 'Assigned').length,
    inProgress: allRequests.filter(r => r.status === 'In Progress').length,
    completed: allRequests.filter(r => r.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: 'Admin',
          dashboardLink: '/admin/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/admin/dashboard', active: false },
            { label: 'Users', path: '/admin/users', active: false },
            { label: 'Requests', path: '/admin/requests', active: true }
          ]
        }}
        notificationCount={3}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Maintenance Requests</h1>
          <p className="text-gray-600 mt-1">View and manage all requests from residents and staff</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <button
            onClick={() => setStatusFilter('All')}
            className={`p-4 rounded-lg border-2 transition ${
              statusFilter === 'All' 
                ? 'border-primary bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">All</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.all}</p>
          </button>

          <button
            onClick={() => setStatusFilter('Pending')}
            className={`p-4 rounded-lg border-2 transition ${
              statusFilter === 'Pending' 
                ? 'border-warning bg-yellow-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-warning mt-1">{statusCounts.pending}</p>
          </button>

          <button
            onClick={() => setStatusFilter('Assigned')}
            className={`p-4 rounded-lg border-2 transition ${
              statusFilter === 'Assigned' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">Assigned</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{statusCounts.assigned}</p>
          </button>

          <button
            onClick={() => setStatusFilter('In Progress')}
            className={`p-4 rounded-lg border-2 transition ${
              statusFilter === 'In Progress' 
                ? 'border-primary bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-primary mt-1">{statusCounts.inProgress}</p>
          </button>

          <button
            onClick={() => setStatusFilter('Completed')}
            className={`p-4 rounded-lg border-2 transition ${
              statusFilter === 'Completed' 
                ? 'border-success bg-green-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-success mt-1">{statusCounts.completed}</p>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="🔍 Search by ID, title, location, or resident..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All Priorities</option>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Carpentry">Carpentry</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {statusFilter !== 'All' && (
                <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                  Status: {statusFilter}
                </span>
              )}
              {priorityFilter !== 'All' && (
                <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                  Priority: {priorityFilter}
                </span>
              )}
              {categoryFilter !== 'All' && (
                <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                  Category: {categoryFilter}
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                  Search: "{searchQuery}"
                </span>
              )}
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setCategoryFilter('All');
                  setSearchQuery('');
                }}
                className="text-sm text-primary hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredRequests.length} of {allRequests.length} requests
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Loading State */}
          {loading && (
            <div className="p-12 text-center">
              <p className="text-gray-600">Loading requests...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}
          {!loading && !error && filteredRequests.length === 0 &&(
            // Empty State
            <div className="p-12 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
            {/* Table */}
          {!loading && !error && filteredRequests.length > 0 && (
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
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <div className="font-medium">{request.title}</div>
                        <div className="text-gray-500 text-xs">{request.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>{request.submittedBy ? `${request.submittedBy.firstName} ${request.submittedBy.lastName}` : 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{request.submittedBy?.unit ? `Unit ${request.submittedBy.unit}` : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${request.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {request.priority === 'High' ? '🔴' : request.priority === 'Medium' ? '🟡' : '🟢'} {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${request.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                            request.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                            request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.assignedTo ? `${request.assignedTo.firstName} ${request.assignedTo.lastName}` : (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/request-details/${request._id}`)}
                          className="text-primary hover:text-blue-700"
                        >
                          View
                        </button>
                        {!request.assignedTo && (
                          <button 
                            onClick={() => handleOpenAssignModal(request)}
                            className="text-success hover:text-green-700 font-medium"
                          >
                            Assign
                          </button>
                        )}
                        <button className="text-secondary hover:text-gray-700">
                          Edit
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assign Technician</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Request:</p>
              <p className="font-semibold text-gray-900">#{selectedRequest.requestId} {selectedRequest.title}</p>
              <p className="text-sm text-gray-600 mt-2">Category: {selectedRequest.category}</p>
              <p className="text-sm text-gray-600">Priority: {selectedRequest.priority}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Technician *
              </label>
              <select
                value={selectedTechnicianId}
                onChange={(e) => setSelectedTechnicianId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a technician...</option>
                {technicians.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.firstName} {tech.lastName} - {tech.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedRequest(null);
                  setSelectedTechnicianId('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTechnician}
                disabled={assignLoading || !selectedTechnicianId}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {assignLoading ? 'Assigning...' : 'Assign Technician'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllRequests;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function MyRequests() {
  // State for filtering
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  // Dummy data - all requests from this resident
  const allRequests = [
    { 
      id: '012', 
      title: 'Leaking Pipe in Bathroom', 
      status: 'In Progress', 
      priority: 'High',
      category: 'Plumbing',
      location: 'Unit 305 - Floor 3',
      submittedDate: 'Feb 10, 2024',
      assignedTo: 'Mike Wilson (Plumber)',
      lastUpdate: 'Working on it, will finish by today',
      updateTime: '2 hours ago',
      description: 'Water leaking from pipe under bathroom sink. Started yesterday evening.'
    },
    { 
      id: '011', 
      title: 'Door Lock Not Working', 
      status: 'Pending', 
      priority: 'Medium',
      category: 'Carpentry',
      location: 'Unit 305 - Floor 3',
      submittedDate: 'Feb 09, 2024',
      assignedTo: 'Not assigned yet',
      lastUpdate: 'Waiting for technician assignment',
      updateTime: 'Yesterday',
      description: 'Main door lock is stuck, difficult to open and close.'
    },
    { 
      id: '008', 
      title: 'AC Not Cooling Properly', 
      status: 'Completed', 
      priority: 'Low',
      category: 'HVAC',
      location: 'Unit 305 - Floor 3',
      submittedDate: 'Feb 05, 2024',
      completedDate: 'Feb 07, 2024',
      assignedTo: 'Sarah Lee (HVAC Tech)',
      lastUpdate: 'AC cleaned and refilled gas. Working perfectly now.',
      updateTime: '3 days ago',
      description: 'Air conditioner not cooling as it should. Might need servicing.'
    },
    { 
      id: '005', 
      title: 'Light Bulb Replacement', 
      status: 'Completed', 
      priority: 'Low',
      category: 'Electrical',
      location: 'Unit 305 - Floor 3',
      submittedDate: 'Feb 01, 2024',
      completedDate: 'Feb 02, 2024',
      assignedTo: 'Tom Chen (Electrician)',
      lastUpdate: 'Replaced all bulbs in living room.',
      updateTime: '1 week ago',
      description: 'Multiple light bulbs in living room need replacement.'
    },
  ];

  // Filter requests based on selected filter
  const filteredRequests = filter === 'All' 
    ? allRequests 
    : allRequests.filter(req => req.status === filter);

  // Count requests by status
  const statusCounts = {
    all: allRequests.length,
    pending: allRequests.filter(r => r.status === 'Pending').length,
    inProgress: allRequests.filter(r => r.status === 'In Progress').length,
    completed: allRequests.filter(r => r.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: 'John Doe',
          subtitle: 'Resident - Unit 305',
          dashboardLink: '/resident/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/resident/dashboard', active: false },
            { label: 'Submit Request', path: '/resident/submit-request', active: false },
            { label: 'My Requests', path: '/resident/my-requests', active: true },
            { label: 'History', path: '/resident/history', active: false }
          ]
        }}
        notificationCount={2}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Maintenance Requests</h1>
          <p className="text-gray-600 mt-1">Track and manage all your submitted requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setFilter('All')}
            className={`p-4 rounded-lg border-2 transition ${
              filter === 'All' 
                ? 'border-primary bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">All Requests</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.all}</p>
          </button>

          <button
            onClick={() => setFilter('Pending')}
            className={`p-4 rounded-lg border-2 transition ${
              filter === 'Pending' 
                ? 'border-warning bg-yellow-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-warning mt-1">{statusCounts.pending}</p>
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
            <p className="text-2xl font-bold text-primary mt-1">{statusCounts.inProgress}</p>
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
            <p className="text-2xl font-bold text-success mt-1">{statusCounts.completed}</p>
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

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {filter !== 'All' ? filter.toLowerCase() : ''} requests found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'All' 
                  ? "You haven't submitted any maintenance requests yet."
                  : `You don't have any ${filter.toLowerCase()} requests.`
                }
              </p>
              <Link
                to="/resident/submit-request"
                className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700 transition"
              >
                Submit New Request
              </Link>
            </div>
          ) : (
            // Request Cards
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          #{request.id} {request.title}
                        </h3>
                        
                        {/* Status Badge */}
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                          request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.status === 'Pending' ? '⏰' : 
                           request.status === 'In Progress' ? '🔵' : '✅'} {request.status}
                        </span>
                        
                        {/* Priority Badge */}
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          request.priority === 'High' ? 'bg-red-100 text-red-800' :
                          request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.priority === 'High' ? '🔴' : 
                           request.priority === 'Medium' ? '🟡' : '🟢'} {request.priority}
                        </span>

                        {/* Category Badge */}
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {request.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">📍 Location:</span> {request.location}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">📅 Submitted:</span> {request.submittedDate}
                      </p>
                      {request.completedDate && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">✅ Completed:</span> {request.completedDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">👷 Assigned to:</span> {request.assignedTo}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">🕐 Last update:</span> {request.updateTime}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {request.description}
                    </p>
                  </div>

                  {/* Latest Update */}
                  <div className="bg-blue-50 border-l-4 border-primary p-4 mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">💬 Latest Update:</p>
                    <p className="text-sm text-gray-700">{request.lastUpdate}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                        onClick={() => navigate(`/resident/request-details/${request.id}`)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium text-sm"
                    >
                        View Full Details
                    </button>
                    {request.status !== 'Completed' && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium text-sm">
                        Add Comment
                      </button>
                    )}
                    {request.status === 'Completed' && (
                      <button className="px-4 py-2 bg-warning text-white rounded-md hover:bg-yellow-600 transition font-medium text-sm">
                        ⭐ Rate Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submit New Request Button (Bottom) */}
        {filteredRequests.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/resident/submit-request"
              className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              + Submit New Request
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyRequests;
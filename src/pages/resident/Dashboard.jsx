import React from 'react';
import { Link } from 'react-router-dom';

function ResidentDashboard() {
  // Dummy data
  const userInfo = {
    name: 'John Doe',
    role: 'Resident',
    unit: 'Unit 305',
    floor: 'Floor 3'
  };

  const stats = {
    totalRequests: 12,
    pending: 3,
    completed: 9
  };

  const myRequests = [
    { 
      id: '012', 
      title: 'Leaking Pipe', 
      status: 'In Progress', 
      priority: 'High',
      submittedDate: 'Feb 10, 2024',
      assignedTo: 'Mike Wilson',
      lastUpdate: '2 hours ago'
    },
    { 
      id: '011', 
      title: 'Door Lock Issue', 
      status: 'Pending', 
      priority: 'Medium',
      submittedDate: 'Feb 09, 2024',
      assignedTo: 'Not assigned yet',
      lastUpdate: 'Yesterday'
    },
    { 
      id: '008', 
      title: 'AC Not Cooling', 
      status: 'Completed', 
      priority: 'Low',
      submittedDate: 'Feb 05, 2024',
      assignedTo: 'Sarah Lee',
      lastUpdate: '3 days ago'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">🏢 BuildingMMS</span>
              <div className="hidden md:flex ml-10 space-x-8">
                <Link to="/resident/dashboard" className="text-gray-900 hover:text-primary px-3 py-2 font-medium">
                  Dashboard
                </Link>
                <Link to="/resident/submit-request" className="text-gray-600 hover:text-primary px-3 py-2 font-medium">
                  Submit Request
                </Link>
                <Link to="/resident/my-requests" className="text-gray-600 hover:text-primary px-3 py-2 font-medium">
                  My Requests
                </Link>
                <Link to="/resident/history" className="text-gray-600 hover:text-primary px-3 py-2 font-medium">
                  History
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-primary">
                <span className="text-xl">🔔</span>
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger rounded-full">
                  2
                </span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{userInfo.name}</p>
                  <p className="text-xs text-gray-500">{userInfo.role} - {userInfo.unit}</p>
                </div>
                <button className="p-2 text-gray-600 hover:text-primary">
                  <span className="text-xl">👤</span>
                </button>
              </div>
              
              <Link to="/login" className="text-gray-600 hover:text-danger font-medium">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userInfo.name}!</h1>
          <p className="text-gray-600 mt-1">{userInfo.unit} • {userInfo.floor}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRequests}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          {/* Pending */}
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

          {/* Completed */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-success mt-2">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔧 Need Maintenance?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📸</span>
                <p className="font-medium text-gray-900">Scan QR Code</p>
                <p className="text-sm text-gray-500">Quick report by location</p>
              </div>
            </button>
            
            <Link to="/resident/submit-request" className="flex items-center justify-center p-6 border-2 border-primary bg-primary rounded-lg hover:bg-blue-700 transition">
              <div className="text-center">
                <span className="text-4xl mb-2 block text-white">📝</span>
                <p className="font-medium text-white">Submit Request</p>
                <p className="text-sm text-blue-100">Fill detailed form</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
            <Link to="/resident/my-requests" className="text-primary hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {myRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">#{request.id} {request.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${request.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                          request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'}`}>
                        {request.status === 'Pending' ? '⏰' : request.status === 'In Progress' ? '🔵' : '✅'} {request.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${request.priority === 'High' ? 'bg-red-100 text-red-800' :
                          request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {request.priority === 'High' ? '🔴' : request.priority === 'Medium' ? '🟡' : '🟢'} {request.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Submitted:</span> {request.submittedDate}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Assigned to:</span> {request.assignedTo}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Last update:</span> {request.lastUpdate}
                    </p>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResidentDashboard;
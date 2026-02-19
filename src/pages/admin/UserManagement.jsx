import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

function UserManagement() {
  const [activeTab, setActiveTab] = useState('residents');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data - all users
  const users = {
    residents: [
      { id: 1, name: 'John Doe', email: 'john@email.com', phone: '+1234567890', unit: '305', floor: '3', status: 'Active', lastLogin: '2 hours ago' },
      { id: 2, name: 'Jane Smith', email: 'jane@email.com', phone: '+0987654321', unit: '501', floor: '5', status: 'Active', lastLogin: '1 day ago' },
      { id: 3, name: 'Bob Johnson', email: 'bob@email.com', phone: '+1122334455', unit: '205', floor: '2', status: 'Active', lastLogin: '3 days ago' },
    ],
    staff: [
      { id: 4, name: 'Alice Brown', email: 'alice@staff.com', phone: '+5544332211', position: 'Receptionist', location: 'Ground Floor - Reception', status: 'Active', lastLogin: '1 hour ago' },
      { id: 5, name: 'Tom Wilson', email: 'tom@staff.com', phone: '+9988776655', position: 'Security', location: 'Ground Floor - Security Office', status: 'Active', lastLogin: '30 mins ago' },
      { id: 6, name: 'Mary Lee', email: 'mary@staff.com', phone: '+6677889900', position: 'Housekeeper', location: 'Floor 3', status: 'Active', lastLogin: '5 hours ago' },
    ],
    technicians: [
      { id: 7, name: 'Mike Wilson', email: 'mike@maintenance.com', phone: '+0987654321', specialization: 'Plumber', status: 'Active', lastLogin: '15 mins ago' },
      { id: 8, name: 'Sarah Lee', email: 'sarah@maintenance.com', phone: '+1231231234', specialization: 'HVAC Technician', status: 'Active', lastLogin: '2 hours ago' },
      { id: 9, name: 'David Chen', email: 'david@maintenance.com', phone: '+3213213210', specialization: 'Electrician', status: 'Active', lastLogin: '1 day ago' },
    ],
    admins: [
      { id: 10, name: 'Admin User', email: 'admin@system.com', phone: '+1111111111', status: 'Active', lastLogin: 'Just now' },
    ]
  };

  // Get current tab data
  const currentUsers = users[activeTab];

  // Filter users by search
  const filteredUsers = currentUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: 'Admin',
          dashboardLink: '/admin/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/admin/dashboard', active: false },
            { label: 'Users', path: '/admin/users', active: true },
            { label: 'Requests', path: '/admin/requests', active: false }
          ]
        }}
        notificationCount={3}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Create and manage all user accounts</p>
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            + Add New User
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('residents')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'residents'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Residents ({users.residents.length})
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'staff'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👔 Staff ({users.staff.length})
              </button>
              <button
                onClick={() => setActiveTab('technicians')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'technicians'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔧 Technicians ({users.technicians.length})
              </button>
              <button
                onClick={() => setActiveTab('admins')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'admins'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👨‍💼 Admins ({users.admins.length})
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredUsers.length === 0 ? (
            // Empty State
            <div className="p-12 text-center">
              <span className="text-6xl mb-4 block">👥</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try adjusting your search' : `No ${activeTab} in the system yet`}
              </p>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700 transition"
              >
                + Add New User
              </button>
            </div>
          ) : (
            // Table
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'residents' ? 'Unit' : activeTab === 'staff' ? 'Position' : 'Specialization'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {activeTab === 'residents' ? `Unit ${user.unit} - Floor ${user.floor}` :
                         activeTab === 'staff' ? user.position :
                         user.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button className="text-primary hover:text-blue-700">
                          Edit
                        </button>
                        <button className="text-warning hover:text-yellow-700">
                          Reset Password
                        </button>
                        <button className="text-danger hover:text-red-700">
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

      {/* Add User Modal - Placeholder */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New User</h2>
            <p className="text-gray-600 mb-6">
              This is a placeholder modal. The full form will be implemented in Week 2-3 when we connect to the backend.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              The form will include: First Name, Last Name, Sex, Email, Phone, Role Selection, and role-specific fields (Unit for residents, Position for staff, Specialization for technicians).
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">
                Save User (Coming in Week 2)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
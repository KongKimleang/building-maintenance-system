import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { registerUser } from '../../services/api';

function UserManagement() {
  const [activeTab, setActiveTab] = useState('residents');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    email: '',
    phone: '',
    role: '',
    floor: '',
    unit: '',
    position: '',
    specialization: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [createdUserCredentials, setCreatedUserCredentials] = useState(null);

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

  // Handle add user form submission
  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    setCreatedUserCredentials(null);

    try {
      // Call backend API
      const data = await registerUser(newUser);
      
      // Show success with credentials
      setCreatedUserCredentials(data.credentials);
      
      // Reset form
      setNewUser({
        firstName: '',
        lastName: '',
        sex: '',
        email: '',
        phone: '',
        role: '',
        floor: '',
        unit: '',
        position: '',
        specialization: ''
      });
      
      // Refresh page or update user list (for now, just show success)
      // In future, we'll add the new user to the list without refresh
      
    } catch (error) {
      setFormError(error.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
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

      {/* Add User Modal - FULL FORM */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h2>
            
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Sex */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sex *
                  </label>
                  <select
                    required
                    value={newUser.sex}
                    onChange={(e) => setNewUser({...newUser, sex: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="resident">Resident</option>
                    <option value="staff">Staff</option>
                    <option value="technician">Technician</option>
                  </select>
                </div>

                {/* Role-Specific Fields - RESIDENT */}
                {newUser.role === 'resident' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Floor *
                      </label>
                      <select
                        required
                        value={newUser.floor}
                        onChange={(e) => setNewUser({...newUser, floor: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select floor</option>
                        <option value="1">Floor 1</option>
                        <option value="2">Floor 2</option>
                        <option value="3">Floor 3</option>
                        <option value="4">Floor 4</option>
                        <option value="5">Floor 5</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.unit}
                        onChange={(e) => setNewUser({...newUser, unit: e.target.value})}
                        placeholder="e.g., 305"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Role-Specific Fields - STAFF */}
                {newUser.role === 'staff' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position *
                      </label>
                      <select
                        required
                        value={newUser.position}
                        onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select position</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Security">Security</option>
                        <option value="Housekeeper">Housekeeper</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Floor *
                      </label>
                      <select
                        required
                        value={newUser.floor}
                        onChange={(e) => setNewUser({...newUser, floor: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select floor</option>
                        <option value="Ground">Ground Floor</option>
                        <option value="1">Floor 1</option>
                        <option value="2">Floor 2</option>
                        <option value="3">Floor 3</option>
                        <option value="4">Floor 4</option>
                        <option value="5">Floor 5</option>
                        <option value="All">All Floors</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Role-Specific Fields - TECHNICIAN */}
                {newUser.role === 'technician' && (
                  <div className="p-4 bg-yellow-50 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <select
                      required
                      value={newUser.specialization}
                      onChange={(e) => setNewUser({...newUser, specialization: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select specialization</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Electrician">Electrician</option>
                      <option value="HVAC Technician">HVAC Technician</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="General Maintenance">General Maintenance</option>
                    </select>
                  </div>
                )}

                {/* Error Message */}
                {formError && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {formError}
                  </div>
                )}

                {/* Success Message with Credentials */}
                {createdUserCredentials && (
                  <div className="p-4 bg-green-100 border border-green-400 rounded">
                    <p className="font-bold text-green-800 mb-2">✅ User Created Successfully!</p>
                    <div className="bg-white p-3 rounded border border-green-300">
                      <p className="text-sm font-medium text-gray-700">Temporary Credentials:</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Username:</span> {createdUserCredentials.username}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Password:</span> {createdUserCredentials.tempPassword}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        ⚠️ Please save these credentials and provide them to the user. They will be required to change the password on first login.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUser({
                      firstName: '',
                      lastName: '',
                      sex: '',
                      email: '',
                      phone: '',
                      role: '',
                      floor: '',
                      unit: '',
                      position: '',
                      specialization: ''
                    });
                    setFormError('');
                    setCreatedUserCredentials(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {createdUserCredentials ? 'Close' : 'Cancel'}
                </button>
                {!createdUserCredentials && (
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {formLoading ? 'Creating...' : 'Create User'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
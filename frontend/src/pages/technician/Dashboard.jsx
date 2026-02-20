import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function TechnicianDashboard() {
  // Dummy data
  const userInfo = {
    name: 'Mike Wilson',
    role: 'Technician',
    specialization: 'Plumber'
  };

  const stats = {
    totalTasksToday: 5,
    pending: 2,
    completedToday: 3
  };

  const myTasks = [
    { 
      id: '012', 
      title: 'Leaking Pipe in Bathroom', 
      location: 'Building - Unit 305',
      floor: 'Floor 3',
      priority: 'High',
      status: 'In Progress',
      assignedTime: '2 hours ago',
      resident: 'John Doe',
      phone: '+1234567890',
      description: 'Water leaking from pipe under bathroom sink. Started yesterday evening.'
    },
    { 
      id: '015', 
      title: 'Toilet Not Flushing', 
      location: 'Building - Unit 501',
      floor: 'Floor 5',
      priority: 'Medium',
      status: 'Pending',
      assignedTime: '1 hour ago',
      resident: 'Jane Smith',
      phone: '+0987654321',
      description: 'Toilet flush mechanism broken, needs replacement.'
    },
    { 
      id: '010', 
      title: 'Water Heater Issue', 
      location: 'Building - Unit 205',
      floor: 'Floor 2',
      priority: 'Low',
      status: 'Pending',
      assignedTime: '30 mins ago',
      resident: 'Bob Johnson',
      phone: '+1122334455',
      description: 'Water heater making strange noises.'
    },
  ];

  const completedToday = [
    { id: '009', title: 'Fixed sink drain', location: 'Unit 402', time: '10:30 AM' },
    { id: '007', title: 'Replaced shower head', location: 'Unit 103', time: '1:45 PM' },
    { id: '006', title: 'Fixed toilet leak', location: 'Unit 308', time: '3:20 PM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: 'Mike Wilson',
          subtitle: 'Plumber',
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {userInfo.name}!</h1>
          <p className="text-gray-600 mt-1">{userInfo.specialization} • Maintenance Department</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Tasks Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTasksToday}</p>
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
          {/* Urgent & Pending Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">🔥 My Assigned Tasks</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {myTasks.map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">#{task.id} {task.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full
                            ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}`}>
                            {task.priority === 'High' ? '🔴' : task.priority === 'Medium' ? '🟡' : '🟢'} {task.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full
                            ${task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {task.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">📍 Location:</span> {task.location} • {task.floor}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">👤 Resident:</span> {task.resident} • {task.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">⏰ Assigned:</span> {task.assignedTime}
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          <span className="font-medium">Description:</span> {task.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      {task.status === 'Pending' && (
                        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium">
                          Start Task
                        </button>
                      )}
                      {task.status === 'In Progress' && (
                        <button className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 transition font-medium">
                          Mark Complete
                        </button>
                      )}
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium">
                        Update Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completed Tasks Today */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">✅ Completed Today</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {completedToday.map((task) => (
                  <div key={task.id} className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                          <span className="text-lg">✅</span>
                        </span>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">#{task.id}</p>
                        <p className="text-sm text-gray-600">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{task.location}</p>
                        <p className="text-xs text-gray-400 mt-1">{task.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TechnicianDashboard;
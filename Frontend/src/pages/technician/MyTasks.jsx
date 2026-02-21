import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function MyTasks() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);

  // Dummy data - all tasks assigned to this technician
  const allTasks = [
    { 
      id: '012', 
      title: 'Leaking Pipe in Bathroom', 
      status: 'In Progress', 
      priority: 'High',
      category: 'Plumbing',
      location: 'Building - Unit 305',
      floor: 'Floor 3',
      assignedDate: 'Feb 10, 2024 11:00 AM',
      dueDate: 'Feb 10, 2024 (Today)',
      resident: {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john.doe@email.com'
      },
      description: 'Water leaking from pipe under bathroom sink. Started yesterday evening. Water pooling on floor.',
      photos: ['photo1.jpg', 'photo2.jpg'],
      lastUpdate: '2 hours ago',
      estimatedTime: '2-3 hours'
    },
    { 
      id: '015', 
      title: 'Toilet Not Flushing', 
      status: 'Pending', 
      priority: 'Medium',
      category: 'Plumbing',
      location: 'Building - Unit 501',
      floor: 'Floor 5',
      assignedDate: 'Feb 10, 2024 1:00 PM',
      dueDate: 'Feb 11, 2024 (Tomorrow)',
      resident: {
        name: 'Jane Smith',
        phone: '+0987654321',
        email: 'jane.smith@email.com'
      },
      description: 'Toilet flush mechanism broken, needs replacement.',
      photos: ['photo3.jpg'],
      lastUpdate: '1 hour ago',
      estimatedTime: '1-2 hours'
    },
    { 
      id: '018', 
      title: 'Kitchen Sink Clogged', 
      status: 'Pending', 
      priority: 'Low',
      category: 'Plumbing',
      location: 'Building - Unit 205',
      floor: 'Floor 2',
      assignedDate: 'Feb 10, 2024 2:30 PM',
      dueDate: 'Feb 12, 2024',
      resident: {
        name: 'Bob Johnson',
        phone: '+1122334455',
        email: 'bob.j@email.com'
      },
      description: 'Kitchen sink draining very slowly. Possibly clogged drain.',
      photos: [],
      lastUpdate: '30 minutes ago',
      estimatedTime: '1 hour'
    },
    { 
      id: '010', 
      title: 'Fixed Shower Head Leak', 
      status: 'Completed', 
      priority: 'Medium',
      category: 'Plumbing',
      location: 'Building - Unit 402',
      floor: 'Floor 4',
      assignedDate: 'Feb 09, 2024',
      completedDate: 'Feb 09, 2024',
      dueDate: 'Feb 09, 2024',
      resident: {
        name: 'Alice Brown',
        phone: '+5544332211',
        email: 'alice.b@email.com'
      },
      description: 'Shower head was leaking. Replaced washer and tested.',
      photos: [],
      lastUpdate: 'Yesterday',
      completionNotes: 'Replaced rubber washer. Leak stopped. Tested for 10 minutes.',
      timeSpent: '45 minutes'
    },
    { 
      id: '007', 
      title: 'Bathroom Faucet Dripping', 
      status: 'Completed', 
      priority: 'Low',
      category: 'Plumbing',
      location: 'Building - Unit 103',
      floor: 'Floor 1',
      assignedDate: 'Feb 08, 2024',
      completedDate: 'Feb 08, 2024',
      dueDate: 'Feb 08, 2024',
      resident: {
        name: 'Tom Wilson',
        phone: '+9988776655',
        email: 'tom.w@email.com'
      },
      description: 'Bathroom faucet constantly dripping.',
      photos: [],
      lastUpdate: '2 days ago',
      completionNotes: 'Tightened valve and replaced O-ring. No more dripping.',
      timeSpent: '30 minutes'
    },
  ];

  // Filter tasks
  const filteredTasks = filter === 'All' 
    ? allTasks 
    : allTasks.filter(task => task.status === filter);

  // Count by status
  const statusCounts = {
    all: allTasks.length,
    pending: allTasks.filter(t => t.status === 'Pending').length,
    inProgress: allTasks.filter(t => t.status === 'In Progress').length,
    completed: allTasks.filter(t => t.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: 'Mike Wilson',
          subtitle: 'Plumber',
          dashboardLink: '/technician/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/technician/dashboard', active: false },
            { label: 'My Tasks', path: '/technician/tasks', active: true },
            { label: 'History', path: '/technician/history', active: false }
          ]
        }}
        notificationCount={5}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Assigned Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track all your maintenance tasks</p>
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

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {filter !== 'All' ? filter.toLowerCase() : ''} tasks found
              </h3>
              <p className="text-gray-600">
                {filter === 'All' 
                  ? "You don't have any assigned tasks yet."
                  : `You don't have any ${filter.toLowerCase()} tasks.`
                }
              </p>
            </div>
          ) : (
            // Task Cards
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          #{task.id} {task.title}
                        </h3>
                        
                        {/* Status Badge */}
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          task.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.status === 'Pending' ? '⏰' : 
                           task.status === 'In Progress' ? '🔵' : '✅'} {task.status}
                        </span>
                        
                        {/* Priority Badge */}
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority === 'High' ? '🔴' : 
                           task.priority === 'Medium' ? '🟡' : '🟢'} {task.priority}
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
                        <span className="font-medium">📍 Location:</span> {task.location}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{task.floor}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">👤 Resident:</span> {task.resident.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">📞</span> {task.resident.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">📅 Assigned:</span> {task.assignedDate}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">⏰ Due:</span> {task.dueDate}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {task.description}
                    </p>
                  </div>

                  {/* Estimated Time */}
                  {task.status !== 'Completed' && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">⏱️ Estimated Time:</span> {task.estimatedTime}
                      </p>
                    </div>
                  )}

                  {/* Completion Notes (for completed tasks) */}
                  {task.status === 'Completed' && task.completionNotes && (
                    <div className="bg-green-50 border-l-4 border-success p-4 mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">✅ Work Completed:</p>
                      <p className="text-sm text-gray-700">{task.completionNotes}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Time spent:</span> {task.timeSpent}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {task.status === 'Pending' && (
                      <>
                        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium text-sm">
                          🚀 Start Task
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium text-sm">
                          📞 Call Resident
                        </button>
                      </>
                    )}
                    
                    {task.status === 'In Progress' && (
                      <>
                        <button className="px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 transition font-medium text-sm">
                          ✅ Mark Complete
                        </button>
                        <button className="px-4 py-2 bg-warning text-white rounded-md hover:bg-yellow-600 transition font-medium text-sm">
                          💬 Add Update
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium text-sm">
                          📸 Upload Photo
                        </button>
                      </>
                    )}
                    
                    <button 
                      onClick={() => navigate(`/technician/task-details/${task.id}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium text-sm"
                    >
                       View Full Details
                    </button>
                    
                    {task.status === 'Completed' && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium text-sm">
                        📄 View Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default MyTasks;
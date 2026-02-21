import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data - same as resident view but with technician perspective
  const task = {
    id: '012',
    title: 'Leaking Pipe in Bathroom',
    description: 'Water is leaking from the pipe under the bathroom sink. The leak started yesterday evening around 6 PM. Water is slowly pooling on the floor and needs urgent attention.',
    category: 'Plumbing',
    priority: 'High',
    status: 'In Progress',
    location: 'Unit 305 - Floor 3',
    floor: '3',
    unit: '305',
    
    submittedBy: {
      name: 'John Doe',
      role: 'Resident',
      unit: '305',
      phone: '+1234567890',
      email: 'john.doe@email.com'
    },
    submittedDate: 'Feb 10, 2024 10:30 AM',
    
    assignedTo: {
      name: 'Mike Wilson',
      role: 'Plumber',
      specialization: 'Plumbing',
      phone: '+0987654321',
      email: 'mike.wilson@maintenance.com'
    },
    assignedDate: 'Feb 10, 2024 11:00 AM',
    
    photos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop', caption: 'Under sink leak' },
      { id: 2, url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop', caption: 'Water pooling on floor' }
    ],
    
    timeline: [
      {
        id: 1,
        type: 'created',
        user: 'John Doe (Resident)',
        action: 'Submitted maintenance request',
        timestamp: 'Feb 10, 2024 10:30 AM',
        note: 'Initial request submitted with photos'
      },
      {
        id: 2,
        type: 'assigned',
        user: 'Admin',
        action: 'Assigned to Mike Wilson (Plumber)',
        timestamp: 'Feb 10, 2024 11:00 AM',
        note: 'High priority - needs immediate attention'
      },
      {
        id: 3,
        type: 'status_update',
        user: 'Mike Wilson (Plumber)',
        action: 'Changed status to "In Progress"',
        timestamp: 'Feb 10, 2024 2:00 PM',
        note: 'On my way to the unit. ETA 30 minutes.'
      },
      {
        id: 4,
        type: 'comment',
        user: 'Mike Wilson (Plumber)',
        action: 'Added comment',
        timestamp: 'Feb 10, 2024 3:15 PM',
        note: 'Inspected the issue. Need to replace the pipe section. Getting parts from storage.'
      },
      {
        id: 5,
        type: 'comment',
        user: 'Mike Wilson (Plumber)',
        action: 'Added update',
        timestamp: 'Feb 10, 2024 4:45 PM',
        note: 'Working on pipe replacement. Almost done, testing for leaks.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - TECHNICIAN */}
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
      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/technician/tasks')}
          className="flex items-center text-primary hover:text-blue-700 font-medium mb-4"
        >
          ← Back to My Tasks
        </button>

        {/* Task Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                #{task.id} {task.title}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  task.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status === 'Pending' ? '⏰' : 
                   task.status === 'In Progress' ? '🔵' : '✅'} {task.status}
                </span>
                
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  task.priority === 'High' ? 'bg-red-100 text-red-800' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority === 'High' ? '🔴' : 
                   task.priority === 'Medium' ? '🟡' : '🟢'} {task.priority} Priority
                </span>

                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
                  📁 {task.category}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600 mb-1">📍 Location</p>
              <p className="font-medium text-gray-900">{task.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">📅 Assigned</p>
              <p className="font-medium text-gray-900">{task.assignedDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">👤 Submitted By</p>
              <p className="font-medium text-gray-900">{task.submittedBy.name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Task Description</h2>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </div>

            {/* Photos */}
            {task.photos && task.photos.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📸 Photos from Resident</h2>
                <div className="grid grid-cols-2 gap-4">
                  {task.photos.map((photo) => (
                    <div key={photo.id} className="space-y-2">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <p className="text-sm text-gray-600">{photo.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🕐 Work Timeline</h2>
              <div className="space-y-4">
                {task.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.type === 'created' ? 'bg-blue-100' :
                        event.type === 'assigned' ? 'bg-purple-100' :
                        event.type === 'status_update' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <span className="text-lg">
                          {event.type === 'created' ? '📝' :
                           event.type === 'assigned' ? '👷' :
                           event.type === 'status_update' ? '🔄' :
                           '💬'}
                        </span>
                      </div>
                      {index < task.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900">{event.action}</p>
                        <p className="text-sm text-gray-600 mt-1">by {event.user}</p>
                        <p className="text-sm text-gray-500 mt-1">{event.timestamp}</p>
                        {event.note && (
                          <p className="text-sm text-gray-700 mt-3 bg-white p-3 rounded border-l-4 border-primary">
                            {event.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Resident Contact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Resident Contact</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{task.submittedBy.name}</p>
                <p className="text-sm text-gray-600">{task.submittedBy.role}</p>
                <p className="text-sm text-gray-600">Unit {task.submittedBy.unit}</p>
                <div className="pt-3 border-t space-y-1">
                  <p className="text-sm text-gray-600">📞 {task.submittedBy.phone}</p>
                  <p className="text-sm text-gray-600">📧 {task.submittedBy.email}</p>
                </div>
                <button className="w-full mt-3 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium">
                  📞 Call Resident
                </button>
              </div>
            </div>

            {/* Technician Actions - DIFFERENT FROM RESIDENT VIEW */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ Task Actions</h3>
              <div className="space-y-3">
                {task.status === 'Pending' && (
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium">
                    🚀 Start Task
                  </button>
                )}
                {task.status === 'In Progress' && (
                  <>
                    <button className="w-full px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 transition font-medium">
                      ✅ Mark Complete
                    </button>
                    <button className="w-full px-4 py-2 bg-warning text-white rounded-md hover:bg-yellow-600 transition font-medium">
                      💬 Add Work Update
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition font-medium">
                      📸 Upload Work Photo
                    </button>
                  </>
                )}
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium">
                  📝 Add Notes
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium">
                  ⏱️ Log Time
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TaskDetails;
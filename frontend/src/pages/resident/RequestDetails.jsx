import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function RequestDetails() {
  const { id } = useParams();  // Get request ID from URL
  const navigate = useNavigate();

  // Dummy data for this specific request
  // In Week 2-4, we'll fetch this from database using the ID
  const request = {
    id: '012',
    title: 'Leaking Pipe in Bathroom',
    description: 'Water is leaking from the pipe under the bathroom sink. The leak started yesterday evening around 6 PM. Water is slowly pooling on the floor and needs urgent attention.',
    category: 'Plumbing',
    priority: 'High',
    status: 'In Progress',
    location: 'Unit 305 - Floor 3',
    floor: '3',
    unit: '305',
    
    // Submitted by
    submittedBy: {
      name: 'John Doe',
      role: 'Resident',
      unit: '305',
      phone: '+1234567890',
      email: 'john.doe@email.com'
    },
    submittedDate: 'Feb 10, 2024 10:30 AM',
    
    // Assigned to
    assignedTo: {
      name: 'Mike Wilson',
      role: 'Plumber',
      specialization: 'Plumbing',
      phone: '+0987654321',
      email: 'mike.wilson@maintenance.com'
    },
    assignedDate: 'Feb 10, 2024 11:00 AM',
    
    // Photos
    photos: [
    { id: 1, url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop', caption: 'Under sink leak' },
    { id: 2, url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop', caption: 'Water pooling on floor' }
    ],
    
    // Timeline of updates
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
      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/resident/my-requests')}
          className="flex items-center text-primary hover:text-blue-700 font-medium mb-4"
        >
          ← Back to My Requests
        </button>

        {/* Request Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                #{request.id} {request.title}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                {/* Status Badge */}
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  request.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                  request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {request.status === 'Pending' ? '⏰' : 
                   request.status === 'In Progress' ? '🔵' : '✅'} {request.status}
                </span>
                
                {/* Priority Badge */}
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  request.priority === 'High' ? 'bg-red-100 text-red-800' :
                  request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {request.priority === 'High' ? '🔴' : 
                   request.priority === 'Medium' ? '🟡' : '🟢'} {request.priority} Priority
                </span>

                {/* Category Badge */}
                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
                  📁 {request.category}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600 mb-1">📍 Location</p>
              <p className="font-medium text-gray-900">{request.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">📅 Submitted</p>
              <p className="font-medium text-gray-900">{request.submittedDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">👷 Assigned To</p>
              <p className="font-medium text-gray-900">{request.assignedTo.name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{request.description}</p>
            </div>

            {/* Photos */}
            {request.photos && request.photos.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📸 Attached Photos</h2>
                <div className="grid grid-cols-2 gap-4">
                  {request.photos.map((photo) => (
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">🕐 Timeline & Updates</h2>
              <div className="space-y-4">
                {request.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    {/* Timeline Icon */}
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
                      {index < request.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Timeline Content */}
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

          {/* Right Column - Contact Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Submitted By */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Submitted By</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{request.submittedBy.name}</p>
                <p className="text-sm text-gray-600">{request.submittedBy.role}</p>
                <p className="text-sm text-gray-600">Unit {request.submittedBy.unit}</p>
                <div className="pt-3 border-t space-y-1">
                  <p className="text-sm text-gray-600">📞 {request.submittedBy.phone}</p>
                  <p className="text-sm text-gray-600">📧 {request.submittedBy.email}</p>
                </div>
              </div>
            </div>

            {/* Assigned Technician */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">👷 Assigned Technician</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{request.assignedTo.name}</p>
                <p className="text-sm text-gray-600">{request.assignedTo.specialization}</p>
                <div className="pt-3 border-t space-y-1">
                  <p className="text-sm text-gray-600">📞 {request.assignedTo.phone}</p>
                  <p className="text-sm text-gray-600">📧 {request.assignedTo.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {request.status !== 'Completed' && (
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium">
                    💬 Add Comment
                  </button>
                )}
                {request.status === 'Completed' && (
                  <button className="w-full px-4 py-2 bg-warning text-white rounded-md hover:bg-yellow-600 transition font-medium">
                    ⭐ Rate Service
                  </button>
                )}
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium">
                  📄 Print Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RequestDetails;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getRequestById } from '../../services/api';

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const data = await getRequestById(id);
      setRequest(data.request);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          userInfo={{
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            subtitle: user.role === 'resident' ? `Resident - Unit ${user.unit || ''}` : `${user.position || 'Staff'}`,
            dashboardLink: '/resident/dashboard',
            navLinks: [
              { label: 'Dashboard', path: '/resident/dashboard', active: false },
              { label: 'Submit Request', path: '/resident/submit-request', active: false },
              { label: 'My Requests', path: '/resident/my-requests', active: true }
            ]
          }}
          notificationCount={2}
        />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading request details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          userInfo={{
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            subtitle: user.role === 'resident' ? `Resident - Unit ${user.unit || ''}` : `${user.position || 'Staff'}`,
            dashboardLink: '/resident/dashboard',
            navLinks: [
              { label: 'Dashboard', path: '/resident/dashboard', active: false },
              { label: 'Submit Request', path: '/resident/submit-request', active: false },
              { label: 'My Requests', path: '/resident/my-requests', active: true }
            ]
          }}
          notificationCount={2}
        />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            Error: {error || 'Request not found'}
          </div>
          <button
            onClick={() => navigate('/resident/my-requests')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
          >
            ← Back to My Requests
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userInfo={{
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          subtitle: user.role === 'resident' ? `Resident - Unit ${user.unit || ''}` : `${user.position || 'Staff'}`,
          dashboardLink: '/resident/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/resident/dashboard', active: false },
            { label: 'Submit Request', path: '/resident/submit-request', active: false },
            { label: 'My Requests', path: '/resident/my-requests', active: true }
          ]
        }}
        notificationCount={2}
      />

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/resident/my-requests')}
          className="mb-4 flex items-center text-primary hover:text-blue-700 font-medium"
        >
          ← Back to My Requests
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Request #{request.requestId}
              </h1>
              <p className="text-xl text-gray-700">{request.title}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Status Badge */}
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                request.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                request.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {request.status}
              </span>
              {/* Priority Badge */}
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                request.priority === 'High' ? 'bg-red-100 text-red-800' :
                request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {request.priority === 'High' ? '🔴' : request.priority === 'Medium' ? '🟡' : '🟢'} {request.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Request Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Category</p>
                  <p className="text-gray-900">{request.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Location</p>
                  <p className="text-gray-900">{request.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Floor</p>
                  <p className="text-gray-900">{request.floor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Unit</p>
                  <p className="text-gray-900">{request.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Submitted Date</p>
                  <p className="text-gray-900">{new Date(request.createdAt).toLocaleString()}</p>
                </div>
                {request.completedDate && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Completed Date</p>
                    <p className="text-gray-900">{new Date(request.completedDate).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium mb-2">Description</p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{request.description}</p>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status Information</h2>
              
              {request.status === 'Pending' && (
                <div className="bg-yellow-50 border-l-4 border-warning p-4">
                  <p className="font-semibold text-gray-900">⏰ Pending Assignment</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Your request has been received and is waiting to be assigned to a technician.
                  </p>
                </div>
              )}

              {request.status === 'Assigned' && request.assignedTo && (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <p className="font-semibold text-gray-900">👤 Assigned to Technician</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Your request has been assigned to {request.assignedTo.firstName} {request.assignedTo.lastName} ({request.assignedTo.specialization}).
                    The technician will contact you soon.
                  </p>
                </div>
              )}

              {request.status === 'In Progress' && (
                <div className="bg-blue-50 border-l-4 border-primary p-4">
                  <p className="font-semibold text-gray-900">🔵 Work In Progress</p>
                  <p className="text-sm text-gray-700 mt-1">
                    The technician is currently working on your request.
                  </p>
                </div>
              )}

              {request.status === 'Completed' && (
                <div className="bg-green-50 border-l-4 border-success p-4">
                  <p className="font-semibold text-gray-900">✅ Work Completed</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Your maintenance request has been completed successfully!
                  </p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Request Timeline</h2>
              
              {request.timeline && request.timeline.length > 0 ? (
                <div className="space-y-4">
                  {request.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-success' : 'bg-primary'
                        }`}></div>
                        {index !== request.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-gray-900">{event.action}</p>
                        {event.note && (
                          <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">{event.note}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No updates yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Technician */}
            {request.assignedTo && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Assigned Technician</h3>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {request.assignedTo.firstName} {request.assignedTo.lastName}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Specialization:</span> {request.assignedTo.specialization}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Phone:</span> {request.assignedTo.phone}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Email:</span> {request.assignedTo.email}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t">
                    <a
                      href={`tel:${request.assignedTo.phone}`}
                      className="block w-full text-center px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 font-medium"
                    >
                      📞 Call Technician
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/resident/my-requests')}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  View All My Requests
                </button>
                <button
                  onClick={() => navigate('/resident/submit-request')}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Submit New Request
                </button>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-4">
                If you have questions about this request, contact building management.
              </p>
              <p className="text-sm font-medium text-gray-900">📞 Management: +1234567890</p>
              <p className="text-sm font-medium text-gray-900">📧 Email: admin@building.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RequestDetails;
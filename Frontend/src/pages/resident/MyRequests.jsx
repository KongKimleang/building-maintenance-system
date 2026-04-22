import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import InputPromptModal from '../../components/InputPromptModal';
import { showError, showSuccess } from '../../utils/toastNotifications';
import { getMyRequests, addComment, updateRequest } from '../../services/api';

function MyRequests() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [filter, setFilter] = useState('All');
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editRequest, setEditRequest] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    floor: '',
    unit: '',
  });
  const [editPhoto, setEditPhoto] = useState(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState('');
  const [removePhoto, setRemovePhoto] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [statusPopup, setStatusPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [commentRequestId, setCommentRequestId] = useState('');
  const [commentSaving, setCommentSaving] = useState(false);

  // Fetch my requests
  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await getMyRequests();
      setAllRequests(data.requests);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  // Add comment handler
  const handleAddComment = async (requestId, comment) => {
    try {
      setCommentSaving(true);
      await addComment(requestId, comment);
      showSuccess('Comment added successfully.');
      setCommentModalOpen(false);
      setCommentDraft('');
      setCommentRequestId('');
      await fetchMyRequests(); // Refresh list
    } catch (error) {
      showError(error.message || 'Failed to add comment');
    } finally {
      setCommentSaving(false);
    }
  };

  const openCommentModal = (requestId) => {
    setCommentRequestId(requestId);
    setCommentDraft('');
    setCommentModalOpen(true);
  };

  const openEditModal = (request) => {
    setEditRequest(request);
    setEditForm({
      title: request.title || '',
      description: request.description || '',
      category: request.category || '',
      priority: request.priority || '',
      floor: request.floor || '',
      unit: request.unit || '',
    });
    setEditPhoto(null);
    setEditPhotoPreview(
      request.photo && request.photo.data
        ? `data:${request.photo.contentType};base64,${request.photo.data}`
        : ''
    );
    setRemovePhoto(false);
    setEditError('');
  };

  const closeEditModal = () => {
    setEditRequest(null);
    setEditPhoto(null);
    setEditPhotoPreview('');
    setRemovePhoto(false);
    setEditError('');
    setEditSaving(false);
  };

  const handleEditPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setEditPhoto(file);
    setRemovePhoto(false);

    const reader = new FileReader();
    reader.onload = () => {
      setEditPhotoPreview(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editRequest) return;

    const requestNumber = editRequest.requestId;

    try {
      setEditSaving(true);
      setEditError('');

      await updateRequest(editRequest._id, {
        ...editForm,
        photo: editPhoto,
        removePhoto: removePhoto && !editPhoto,
      });

      closeEditModal();
      await fetchMyRequests();
      setStatusPopup({
        isOpen: true,
        title: 'Request Updated',
        message: `Request #${requestNumber} was resubmitted successfully.`,
      });
    } catch (err) {
      setEditError(err.message || 'Failed to update request');
    } finally {
      setEditSaving(false);
    }
  };

  // Filter requests based on selected filter
  const filteredRequests =
    filter === 'All'
      ? allRequests
      : allRequests.filter((req) => req.status === filter);

  // Count requests by status
  const statusCounts = {
    all: allRequests.length,
    pending: allRequests.filter((r) => r.status === 'Pending').length,
    inProgress: allRequests.filter((r) => r.status === 'In Progress').length,
    completed: allRequests.filter((r) => r.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: `${user.firstName} ${user.lastName}`,
          subtitle:
            user.role === 'resident'
              ? `Resident - Unit ${user.unit}`
              : `${user.position}`,
          dashboardLink: '/resident/dashboard',
        }}
        navLinks={[
          { label: 'Dashboard', path: '/resident/dashboard' },
          { label: 'Submit Request', path: '/resident/submit-request' },
          { label: 'My Requests', path: '/resident/my-requests' },
          { label: 'History', path: '/resident/history' },
        ]}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow">
          <p className="text-xs uppercase tracking-[0.12em] text-gray-500">Request Tracking</p>
          <h1 className="text-3xl font-bold text-gray-900">
            My Maintenance Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your submitted requests
          </p>
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
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {statusCounts.all}
            </p>
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
            <p className="text-2xl font-bold text-warning mt-1">
              {statusCounts.pending}
            </p>
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
            <p className="text-2xl font-bold text-primary mt-1">
              {statusCounts.inProgress}
            </p>
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
            <p className="text-2xl font-bold text-success mt-1">
              {statusCounts.completed}
            </p>
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
          {loading && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">Loading your requests...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          {!loading && !error && filteredRequests.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {filter !== 'All' ? filter.toLowerCase() : ''} requests found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'All'
                  ? "You haven't submitted any maintenance requests yet."
                  : `You don't have any ${filter.toLowerCase()} requests.`}
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
              <div
                key={request._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">
                          #{request.requestId} {request.title}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            request.status === 'Pending'
                              ? 'bg-gray-100 text-gray-800'
                              : request.status === 'Assigned'
                                ? 'bg-purple-100 text-purple-800'
                                : request.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {request.status}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            request.priority === 'High'
                              ? 'bg-red-100 text-red-800'
                              : request.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {request.priority}
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
                        <span className="font-medium">Location:</span>{' '}
                        {request.location}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Submitted:</span>{' '}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      {request.completedDate && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Completed:</span>{' '}
                          {new Date(request.completedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Assigned to:</span>{' '}
                        {request.assignedTo
                          ? `${request.assignedTo.firstName} ${request.assignedTo.lastName} (${request.assignedTo.specialization})`
                          : 'Not assigned yet'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Last update:</span>{' '}
                        {new Date(request.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Description:
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {request.description}
                    </p>
                  </div>

                  {request.photo && request.photo.data && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Uploaded Photo:
                      </p>
                      <img
                        src={`data:${request.photo.contentType};base64,${request.photo.data}`}
                        alt="Request"
                        className="w-full max-w-sm rounded-lg border border-gray-300 object-cover"
                      />
                    </div>
                  )}

                  {/* Latest Update */}
                  {request.timeline && request.timeline.length > 0 && (
                    <div className="bg-blue-50 border-l-4 border-primary p-4 mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Latest Update:
                      </p>
                      <p className="text-sm text-gray-700">
                        {request.timeline[request.timeline.length - 1].action}
                      </p>
                      {request.timeline[request.timeline.length - 1].note && (
                        <p className="text-sm text-gray-600 mt-1">
                          {request.timeline[request.timeline.length - 1].note}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() =>
                        navigate(`/resident/request-details/${request._id}`)
                      }
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium text-sm"
                    >
                      View Full Details
                    </button>
                    {request.status === 'Pending' && (
                      <button
                        onClick={() => openEditModal(request)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition font-medium text-sm"
                      >
                        Edit Request
                      </button>
                    )}
                    {request.status !== 'Completed' && (
                      <button
                        onClick={() => openCommentModal(request._id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium text-sm"
                      >
                        Add Comment
                      </button>
                    )}
                    {request.status === 'Completed' && (
                      <button className="px-4 py-2 bg-warning text-white rounded-md hover:bg-yellow-600 transition font-medium text-sm">
                        Rate Service
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
              Submit New Request
            </Link>
          </div>
        )}
      </main>

      {editRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-6">
          <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Edit Request
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Request #{editRequest.requestId}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg border border-slate-200 px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                X
              </button>
            </div>

            <form
              className="flex max-h-[calc(100vh-7rem)] flex-col"
              onSubmit={handleSaveEdit}
            >
              <div className="space-y-5 overflow-y-auto px-6 py-5">
                {editError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                    {editError}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                  <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>HVAC</option>
                    <option>Carpentry</option>
                    <option>Appliance</option>
                    <option>Cleaning</option>
                    <option>Mechanical</option>
                    <option>Other</option>
                  </select>
                </div>
                  <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, priority: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                  <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Floor
                  </label>
                  <input
                    type="text"
                    value={editForm.floor}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, floor: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                  <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={editForm.unit}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Replace Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditPhotoChange}
                      className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Upload a new image to replace the current one.
                    </p>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        setRemovePhoto(true);
                        setEditPhoto(null);
                        setEditPhotoPreview('');
                      }}
                      className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/60"
                    >
                      Remove current photo
                    </button>
                  </div>
                </div>

                {editPhotoPreview && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Photo Preview
                    </p>
                    <img
                      src={editPhotoPreview}
                      alt="Preview"
                      className="max-h-64 w-full rounded-lg border border-slate-200 object-contain bg-white dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                )}

                {removePhoto && !editPhoto && !editPhotoPreview && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-300">
                    Current photo will be removed when you resubmit.
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {editSaving ? 'Resubmitting...' : 'Resubmit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statusPopup.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">{statusPopup.title}</h3>
            <p className="mt-2 text-slate-600">{statusPopup.message}</p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setStatusPopup({ isOpen: false, title: '', message: '' })
                }
                className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <InputPromptModal
        isOpen={commentModalOpen}
        title="Add Comment"
        message="Share an update or question for this request."
        value={commentDraft}
        onChange={setCommentDraft}
        onCancel={() => {
          setCommentModalOpen(false);
          setCommentDraft('');
          setCommentRequestId('');
        }}
        onConfirm={() => handleAddComment(commentRequestId, commentDraft)}
        confirmLabel="Submit Comment"
        placeholder="Type your comment here..."
        loading={commentSaving}
      />
    </div>
  );
}

export default MyRequests;

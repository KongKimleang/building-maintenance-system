const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');

const ALLOWED_REQUEST_STATUSES = [
  'Pending',
  'Assigned',
  'In Progress',
  'Completed',
  'Cancelled',
];

const buildPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const requestedLimit = parseInt(query.limit, 10) || 20;
  const limit = Math.min(Math.max(requestedLimit, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getNextRequestId = async () => {
  const latestRequest = await Request.findOne({ requestId: { $exists: true } })
    .sort({ createdAt: -1 })
    .select('requestId');

  const latestNumber = parseInt(latestRequest?.requestId, 10);
  const nextNumber = Number.isFinite(latestNumber) ? latestNumber + 1 : 1;
  return String(nextNumber).padStart(3, '0');
};

const createNotification = async (userId, type, title, message, requestId) => {
  try {
    await Notification.create({ userId, type, title, message, requestId });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

const notifyUsers = async ({
  userIds,
  type,
  title,
  message,
  requestId,
  excludeUserId,
}) => {
  const excludeId = excludeUserId ? String(excludeUserId) : null;
  const uniqueUserIds = [...new Set((userIds || []).filter(Boolean).map((id) => String(id)))].filter(
    (id) => !excludeId || id !== excludeId
  );

  if (!uniqueUserIds.length) {
    return;
  }

  await Promise.all(
    uniqueUserIds.map((id) =>
      createNotification(id, type, title, message, requestId)
    )
  );
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Private (Resident, Staff)
const createRequest = async (req, res) => {
  try {
    const { title, description, category, priority, floor, unit } = req.body;

    if (!title || !description || !category || !priority || !floor || !unit) {
      return res.status(400).json({
        message:
          'Title, description, category, priority, floor, and unit are required',
      });
    }

    // Create location string
    const location = `Unit ${unit} - Floor ${floor}`;

    // Handle file upload
    let photoData = null;
    if (req.file) {
      photoData = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const requestId = await getNextRequestId();

    // Create request
    const request = await Request.create({
      requestId,
      title,
      description,
      category,
      priority,
      floor,
      unit,
      location,
      submittedBy: req.user.id,
      timeline: [
        {
          type: 'created',
          user: `${req.user.firstName} ${req.user.lastName} (${req.user.role})`,
          action: 'Submitted maintenance request',
          note: 'Initial request submitted',
          timestamp: new Date(),
        },
      ],
      ...(photoData && { photo: photoData }),
    });

    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification(
        admin._id,
        'new_request',
        'New Maintenance Request',
        `${req.user.firstName} submitted: ${request.title}`,
        request._id
      );
    }

    await request.populate(
      'submittedBy',
      'firstName lastName email phone unit'
    );

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request,
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin, Technician)
const getAllRequests = async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);

    const [requests, total] = await Promise.all([
      Request.find()
      .populate('submittedBy', 'firstName lastName email phone unit')
      .populate('assignedTo', 'firstName lastName specialization phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
      Request.countDocuments(),
    ]);

    // Convert photo buffers to base64
    const requestsWithPhotos = requests.map((req) => {
      const reqObj = req.toObject();
      if (reqObj.photo && reqObj.photo.data) {
        reqObj.photo.data = reqObj.photo.data.toString('base64');
      }
      return reqObj;
    });

    res.status(200).json({
      success: true,
      count: requestsWithPhotos.length,
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      requests: requestsWithPhotos,
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my requests (current user only)
// @route   GET /api/requests/my-requests
// @access  Private (Resident, Staff)
const getMyRequests = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const { page, limit, skip } = buildPagination(req.query);

    // CRITICAL: Always filter by current user
    let filter = { submittedBy: req.user._id };

    // Add optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    if (search && String(search).trim()) {
      const searchText = String(search).trim();
      filter.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
        { requestId: { $regex: searchText, $options: 'i' } },
        { unit: { $regex: searchText, $options: 'i' } },
      ];
    }

    const [requests, total] = await Promise.all([
      Request.find(filter)
      .populate('submittedBy', 'firstName lastName email phone unit floor')
      .populate('assignedTo', 'firstName lastName specialization phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
      Request.countDocuments(filter),
    ]);

    // Convert photo buffers to base64
    const requestsWithPhotos = requests.map((req) => {
      const reqObj = req.toObject();
      if (reqObj.photo && reqObj.photo.data) {
        reqObj.photo.data = reqObj.photo.data.toString('base64');
      }
      return reqObj;
    });

    res.status(200).json({
      success: true,
      count: requestsWithPhotos.length,
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      requests: requestsWithPhotos,
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName email phone unit role')
      .populate('assignedTo', 'firstName lastName specialization phone email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Convert photo buffer to base64 for frontend
    let requestData = request.toObject();
    if (requestData.photo && requestData.photo.data) {
      requestData.photo.data = requestData.photo.data.toString('base64');
    }

    res.status(200).json({
      success: true,
      request: requestData,
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign technician to request
// @route   PUT /api/requests/:id/assign
// @access  Private (Admin)
const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({ message: 'technicianId is required' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status === 'Completed' || request.status === 'Cancelled') {
      return res.status(400).json({
        message: `Cannot assign technician to a ${request.status.toLowerCase()} request`,
      });
    }

    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
      return res.status(400).json({ message: 'Invalid technician' });
    }

    request.assignedTo = technicianId;
    request.status = 'Assigned';
    request.timeline.push({
      type: 'assigned',
      user: `${req.user.firstName} ${req.user.lastName}`,
      action: `Assigned to ${technician.firstName} ${technician.lastName} (${technician.specialization})`,
      note: `${request.priority} priority - needs attention`,
      timestamp: new Date(),
    });

    await request.save();

    await createNotification(
      technicianId,
      'assigned',
      'New Task Assigned',
      `You have been assigned: ${request.title}`,
      request._id
    );

    await createNotification(
      request.submittedBy,
      'assigned',
      'Request Assigned',
      `Your request "${request.title}" has been assigned to a technician`,
      request._id
    );

    await request.populate(
      'assignedTo',
      'firstName lastName specialization phone email'
    );

    res.status(200).json({
      success: true,
      message: 'Technician assigned successfully',
      request,
    });
  } catch (error) {
    console.error('Assign technician error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private (Technician, Admin)
const updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!ALLOWED_REQUEST_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${ALLOWED_REQUEST_STATUSES.join(', ')}`,
      });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;

    if (status === 'Completed') {
      request.completedDate = new Date();
    }

    request.timeline.push({
      type: 'status_update',
      user: `${req.user.firstName} ${req.user.lastName} (${req.user.role})`,
      action: `Changed status to "${status}"`,
      note: notes || `Status updated to ${status}`,
      timestamp: new Date(),
    });

    await request.save();

    // Resident notifications: when technician starts/updates task
    if (req.user.role === 'technician') {
      await createNotification(
        request.submittedBy,
        'status_update',
        'Request Status Updated',
        `Technician ${req.user.firstName} updated your request "${request.title}" to: ${status}`,
        request._id
      );

      // Admin notifications: when technician starts/updates task
      const admins = await User.find({ role: 'admin' }).select('_id');
      await notifyUsers({
        userIds: admins.map((admin) => admin._id),
        type: 'status_update',
        title: 'Technician Update',
        message: `${req.user.firstName} ${req.user.lastName} updated "${request.title}" to ${status}`,
        requestId: request._id,
        excludeUserId: req.user._id,
      });
    }

    // Technician notifications: when someone else changes status
    if (
      request.assignedTo &&
      String(request.assignedTo) !== String(req.user._id)
    ) {
      await createNotification(
        request.assignedTo,
        'status_update',
        'Task Updated',
        `${req.user.firstName} ${req.user.lastName} changed "${request.title}" to ${status}`,
        request._id
      );
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      request,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get request statistics
// @route   GET /api/requests/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const total = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: 'Pending' });
    const assigned = await Request.countDocuments({ status: 'Assigned' });
    const inProgress = await Request.countDocuments({ status: 'In Progress' });
    const completed = await Request.countDocuments({ status: 'Completed' });
    const cancelled = await Request.countDocuments({ status: 'Cancelled' });

    const byCategory = await Request.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const byPriority = await Request.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const recent = await Request.find()
      .populate('submittedBy', 'firstName lastName')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        assigned,
        inProgress,
        completed,
        cancelled,
        byCategory,
        byPriority,
        recent,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add comment to request timeline
// @route   POST /api/requests/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.timeline.push({
      type: 'comment',
      user: `${req.user.firstName} ${req.user.lastName} (${req.user.role})`,
      action: 'Added a comment',
      note: comment,
      timestamp: new Date(),
    });

    await request.save();

    const actorName = `${req.user.firstName} ${req.user.lastName}`;

    // Admin notifications: when anyone adds a comment
    const admins = await User.find({ role: 'admin' }).select('_id');
    await notifyUsers({
      userIds: admins.map((admin) => admin._id),
      type: 'comment',
      title: 'New Request Comment',
      message: `${actorName} commented on "${request.title}"`,
      requestId: request._id,
      excludeUserId: req.user._id,
    });

    // Resident notifications: when technician adds updates/comments
    if (
      req.user.role === 'technician' &&
      String(request.submittedBy) !== String(req.user._id)
    ) {
      await createNotification(
        request.submittedBy,
        'comment',
        'Technician Comment',
        `Technician ${actorName} added an update on "${request.title}"`,
        request._id
      );
    }

    // Technician notifications: when resident/anyone adds comment
    if (
      request.assignedTo &&
      String(request.assignedTo) !== String(req.user._id)
    ) {
      await createNotification(
        request.assignedTo,
        'comment',
        'New Comment on Task',
        `${actorName} added a comment on "${request.title}"`,
        request._id
      );
    }

    res.status(200).json({
      success: true,
      message: 'Comment added',
      request,
    });
  } catch (error) {
    console.error('Add comment error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update own request
// @route   PUT /api/requests/:id
// @access  Private (Owner, Pending only)
const updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (String(request.submittedBy) !== String(req.user.id)) {
      return res.status(403).json({ message: 'You can only edit your own request' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        message: 'Only pending requests can be edited',
      });
    }

    const { title, description, category, priority, floor, unit, removePhoto } = req.body;

    if (!title || !description || !category || !priority || !floor || !unit) {
      return res.status(400).json({
        message:
          'Title, description, category, priority, floor, and unit are required',
      });
    }

    request.title = title;
    request.description = description;
    request.category = category;
    request.priority = priority;
    request.floor = floor;
    request.unit = unit;
    request.location = `Unit ${unit} - Floor ${floor}`;

    if (req.file) {
      request.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } else if (removePhoto === 'true' || removePhoto === true || removePhoto === '1') {
      request.set('photo', undefined);
    }

    request.timeline.push({
      type: 'edited',
      user: `${req.user.firstName} ${req.user.lastName} (${req.user.role})`,
      action: 'Updated request details',
      note: 'Resident edited the request information',
      timestamp: new Date(),
    });

    await request.save();

    // Technician notifications: when resident changes request details
    if (request.assignedTo) {
      await createNotification(
        request.assignedTo,
        'status_update',
        'Task Details Updated',
        `${req.user.firstName} ${req.user.lastName} updated request details for "${request.title}"`,
        request._id
      );
    }

    await request.populate('submittedBy', 'firstName lastName email phone unit');

    res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      request,
    });
  } catch (error) {
    console.error('Update request error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Admin)
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Delete request error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get requests assigned to logged in technician
// @route   GET /api/requests/my-tasks
// @access  Private (Technician)
const getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const { page, limit, skip } = buildPagination(req.query);
    let filter = { assignedTo: req.user._id };
    if (status) filter.status = status;

    const [requests, total] = await Promise.all([
      Request.find(filter)
      .populate('submittedBy', 'firstName lastName email phone unit floor')
      .populate('assignedTo', 'firstName lastName specialization phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
      Request.countDocuments(filter),
    ]);

    // Convert photo buffers to base64
    const requestsWithPhotos = requests.map((req) => {
      const reqObj = req.toObject();
      if (reqObj.photo && reqObj.photo.data) {
        reqObj.photo.data = reqObj.photo.data.toString('base64');
      }
      return reqObj;
    });

    res.status(200).json({
      success: true,
      count: requestsWithPhotos.length,
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      requests: requestsWithPhotos,
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  getMyTasks,
  getRequestById,
  assignTechnician,
  updateStatus,
  getStats,
  addComment,
  updateRequest,
  deleteRequest,
  createNotification,
};
